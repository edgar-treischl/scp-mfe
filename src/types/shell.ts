type ShellRole = 'stmuk' | 'regierung' | 'schulamt' | 'fachadmin' | 'isb' | 'admin';

export type ShellContext = {
  readonly user: {
    readonly id: string;
    readonly username: string;
    readonly name: string;
    readonly displayName?: string;
    readonly email: string;
    readonly roles: readonly ShellRole[];
    readonly defaultRole: ShellRole;
    readonly regbez: readonly string[] | null;
    readonly samt: readonly string[] | null;
  };
  readonly activeRole: ShellRole;
};

export type ShellAppProps = {
  readonly shellContext?: ShellContext;
};
