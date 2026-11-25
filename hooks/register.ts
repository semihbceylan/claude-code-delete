import type { Register } from 'claude-code'

// Deletes every local file of session $1 (transcript, file history, todos,
// debug log, scratchpad, prompt-history lines). Runs after /clear, so the
// old session is no longer being written.
const WIPE = `
set -u
C="$HOME/.claude"; ID="$1"
[[ "$ID" =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]] || { echo "bad session id"; exit 1; }
n=0
while IFS= read -r f; do [ -n "$f" ] && rm -rf -- "$f" && n=$((n+1)); done < <(
  find "$C/projects" -maxdepth 2 \\( -name "$ID.jsonl" -o -name "$ID" \\) 2>/dev/null
  for d in file-history session-env todos debug; do ls -d "$C/$d/$ID"* 2>/dev/null; done
  for t in /private/tmp /tmp; do ls -d "$t/claude-$(id -u)"/*/"$ID" "$t/claude-$(id -u)/cache-break-state-$ID.json" 2>/dev/null; done
)
if [ -f "$C/history.jsonl" ]; then
  grep -v "\\"sessionId\\":\\"$ID\\"" "$C/history.jsonl" > "$C/history.jsonl.tmp"; mv "$C/history.jsonl.tmp" "$C/history.jsonl"
fi
echo "$n"
`

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'delete',
      description: "Delete this chat's local files and start a fresh chat",
    })
    return next(e)
  })

  on('command.run', { command: 'delete' }, async $ => {
    const oldId = await $.session.id()
    // /clear can't run from inside this command's own hook (it would wait on
    // itself), so run it right after this hook has returned.
    $.clock.after(50, async () => {
      await $.command.run({ command: 'clear' })
      const r = await $.process.run(['bash', '-c', WIPE, 'wipe', oldId])
      await $.ui.toast(
        r.exitCode === 0
          ? `Previous chat deleted from disk (${r.stdout.trim()} items).`
          : `Deleting the previous chat failed: ${(r.stderr || r.stdout).trim()}`,
      )
    })
    return { text: 'Deleting this chat and starting a fresh one…', isTextDisplayOnly: true }
  })
}
