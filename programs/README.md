# programs/ — optional Anchor stretch

v1 of Cookie Crumb Board does **not** require a custom program. It uses:

- SPL Memo (`MemoSq4gqABAXKb96qnH8TysNcWxMyW5Xbd1vKuhp74`)
- `SystemProgram.transfer` for optional tips

## If you add a real program (~half day+)

```bash
# against Cookie RPC
solana config set --url https://rpc.cookiescan.io
anchor init crumb_board --javascript
# point Anchor.toml cluster URL to https://rpc.cookiescan.io
anchor build
solana program deploy target/deploy/crumb_board.so
```

Suggested account model:

- `Board` PDA — authority + crumb count
- `Crumb` PDA — author, timestamp, memo hash / string

Wire the program id into `app/src/cookieChain.ts` and replace `buildCrumbTx` with an Anchor instruction.

Program deploys on Cookie Chain are documented as ~cents — iterate freely (https://docs.cookiechain.wtf/developer-guide).
