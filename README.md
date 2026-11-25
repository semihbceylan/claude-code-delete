# claude-code-delete

Adds a `/delete` command to Claude Code that **permanently deletes the current chat from your computer and starts a fresh one**.

Made for the Claude Code terminal (CLI). In the desktop app, use its built-in delete instead.

The built-in `/clear` only empties the screen: the old conversation stays on disk and can be brought back with `/resume`. `/delete` starts a fresh chat the same way, then removes everything Claude Code stored locally for the old one:

- the conversation transcript (`~/.claude/projects/...`)
- file-edit history, todos, session env and debug logs
- the session's scratchpad / temp folder and cache file
- its prompts in `~/.claude/history.jsonl` (the up-arrow history)

No need to `/exit` afterwards — you're already in a new chat.

> This only deletes local files. It does not affect anything stored on Anthropic's servers.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install delete-session --marketplace semihbceylan/claude-code-delete
```

Answer `y` to add the marketplace, then press Enter to install for your user. 

From a shell:

```
claude plugin install delete-session --marketplace semihbceylan/claude-code-delete
```

In the desktop app: click **+** next to the prompt box → **Plugins** → **Add marketplace** with `semihbceylan/claude-code-delete` → **Add plugin**.

## Use

Type `/delete` and press Enter.

## License

MIT
