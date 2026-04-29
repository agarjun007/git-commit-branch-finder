import * as vscode from 'vscode';
import * as cp from 'child_process';

export interface BranchInfo {
  name: string;
  distance: number;
  isOriginal: boolean;
}

export interface BranchResult {
  found: boolean;
  branches: BranchInfo[];
  commitHash: string;
  commitMessage?: string;
  error?: string;
}

export class GitBranchFinder {
  private getWorkspaceRoot(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('No workspace folder is open');
    }

    return workspaceFolders[0].uri.fsPath;
  }

  private executeGitCommand(args: string[], cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cp.execFile(
        'git',
        args,
        { cwd, maxBuffer: 10 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error && !stdout) {
            reject(new Error(stderr || error.message));
          } else {
            resolve(stdout.trim());
          }
        }
      );
    });
  }

  async findBranchesForCommit(commitId: string): Promise<BranchResult> {
    const workspaceRoot = this.getWorkspaceRoot();
    const normalizedCommitId = commitId.trim();

    try {
      let fullHash = '';

      try {
        fullHash = await this.executeGitCommand(
          ['rev-parse', normalizedCommitId],
          workspaceRoot
        );
      } catch {
        return await this.searchByCommitMessage(normalizedCommitId, workspaceRoot);
      }

      let commitMessage = '';

      try {
        commitMessage = await this.executeGitCommand(
          ['log', '-1', '--format=%s', fullHash],
          workspaceRoot
        );
      } catch {
        commitMessage = 'Unknown';
      }

      const branchesOutput = await this.executeGitCommand(
        ['branch', '-a', '--contains', fullHash],
        workspaceRoot
      );

      const branchNames = branchesOutput
        .split('\n')
        .map(b => b.replace(/^\*?\s+/, '').trim())
        .filter(Boolean)
        .filter(b => !b.includes('HEAD detached'));

      if (branchNames.length === 0) {
        return {
          found: false,
          branches: [],
          commitHash: fullHash,
          commitMessage,
          error: 'Commit not found in any branch'
        };
      }

      const branchInfos: BranchInfo[] = await Promise.all(
        branchNames.map(async branchName => {
          const distance = await this.getCommitDistanceFromHead(
            fullHash,
            branchName,
            workspaceRoot
          );

          return {
            name: branchName,
            distance,
            isOriginal: false
          };
        })
      );

      branchInfos.sort((a, b) => a.distance - b.distance);

      const detectedOriginal = await this.detectOriginalBranch(
        fullHash,
        branchInfos,
        workspaceRoot
      );

      if (detectedOriginal) {
        branchInfos.forEach(branch => {
          branch.isOriginal = branch.name === detectedOriginal;
        });
      } else if (branchInfos.length > 0) {
        branchInfos[0].isOriginal = true;
      }

      return {
        found: true,
        branches: branchInfos,
        commitHash: fullHash,
        commitMessage
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        found: false,
        branches: [],
        commitHash: normalizedCommitId,
        error: errorMessage
      };
    }
  }

  private async getCommitDistanceFromHead(
    commitHash: string,
    branchName: string,
    cwd: string
  ): Promise<number> {
    try {
      const output = await this.executeGitCommand(
        ['rev-list', '--count', `${commitHash}..${branchName}`],
        cwd
      );

      return parseInt(output, 10) || 999999;
    } catch {
      return 999999;
    }
  }

  private async detectOriginalBranch(
    commitHash: string,
    branches: BranchInfo[],
    cwd: string
  ): Promise<string | undefined> {
    try {
      const output = await this.executeGitCommand(
        ['name-rev', '--name-only', commitHash],
        cwd
      );

      if (!output) {
        return undefined;
      }

      let detectedBranch = output
        .split('~')[0]
        .split('^')[0]
        .trim();

      detectedBranch = detectedBranch.replace(/^remotes\//, '');

      const matched = branches.find(branch => {
        const normalized = branch.name.replace(/^remotes\//, '');
        return normalized === detectedBranch;
      });

      return matched?.name;
    } catch {
      return undefined;
    }
  }


  private async searchByCommitMessage(
    query: string,
    cwd: string
  ): Promise<BranchResult> {
    try {
      const logOutput = await this.executeGitCommand(
        ['log', '--all', '--grep=' + query, '--format=%H', '-i', '-n', '1'],
        cwd
      );

      if (!logOutput) {
        return {
          found: false,
          branches: [],
          commitHash: query,
          error: `No commits found matching: ${query}`
        };
      }

      return await this.findBranchesForCommit(logOutput);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        found: false,
        branches: [],
        commitHash: query,
        error: `Search failed: ${errorMessage}`
      };
    }
  }
}