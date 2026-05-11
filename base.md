# DS2API Core Mechanism

DS2API acts as an API adapter and gateway that converts DeepSeek Web Chat capabilities into standardized, OpenAI/Claude/Gemini-compatible APIs. The core backend is built in Go for high performance and concurrency, alongside a small Node Runtime bridge for Vercel streaming support, and a React-based WebUI for administration.

## Core Flow and Components

The architecture centers around intercepting standard API requests, translating them into DeepSeek web-chat plain-text payloads, communicating with the upstream Web API, and parsing the web response back into standard API schema formats.

### 1. HTTP API Surface & Routing (`internal/httpapi`)
- Handles incoming API requests for various target platforms: OpenAI (`/v1/*`), Claude (`/anthropic/v1/*`), Gemini (`/v1beta/*`), and Ollama.
- **Middlewares**: Built using a `chi` router to manage request IDs, RealIP extraction, logging, crash recovery, and unified CORS handling across all mocked API shapes.

### 2. Prompt Compatibility Core (`internal/promptcompat`)
- **Context Translation**: The crucial layer responsible for transforming structured conversational requests (roles, tool configurations, multi-modal content) from OpenAI/Claude/Gemini into the plain-text conversational context expected by DeepSeek's Web UI endpoints.
- **Context Management**: For long conversation histories, it splits context and seamlessly uploads it as a text file (`DS2API_HISTORY.txt`) to bypass token context window limitations inherently present in web sessions.

### 3. Execution & Runtime (`internal/completionruntime`, `internal/assistantturn`)
- **Completion Runtime (`internal/completionruntime`)**: Manages the Go completion execution lifecycle. It controls DeepSeek session initiation, solves upstream anti-bot Proof of Work (PoW) challenges, handles upstream request execution, and manages compensation retries for empty-outputs and managed-account rotations.
- **DeepSeek Client (`internal/deepseek`)**: The upstream client performing the direct interactions with the DeepSeek Web API (handling login, sessions, completions, and file uploads).
- **Assistant Turn (`internal/assistantturn`)**: The output normalization layer. It takes raw DeepSeek SSE (Server-Sent Events) results and stream completion states, extracts "thinking" tokens, and centralizes tool calls, citations, usage statistics, and error handling to form a canonical response for the client.

### 4. Concurrency & Account Management (`internal/account`, `internal/auth`)
- **Account Pool & Queue (`internal/account`)**: Controls multi-account load balancing. It enforces per-account in-flight limits, dynamically placing excess requests into a waiting queue to minimize immediate HTTP 429 Too Many Requests errors.
- **Auth Resolver (`internal/auth`)**: Resolves API keys and tokens. It dictates whether a request should be routed through a "Managed Account" (picking an internal DeepSeek account) or use a "Direct Token" (passing the client's token directly upstream).

### 5. Advanced Capabilities (`pow`, `internal/toolcall`)
- **PoW Solver (`pow`)**: A pure Go implementation of the DeepSeek Proof of Work solver (`DeepSeekHashV1`), ensuring millisecond-level challenge responses without needing headless browsers.
- **Tool Sieve & Call Parser (`internal/toolcall`, `internal/toolstream`)**: Features robust anti-leak tool call handling. It identifies tool call patterns (e.g., DSML shell syntax or legacy XML) outside of code blocks, preventing standard AI text from bleeding into tool argument streams, and structurally formats them into JSON native to the client's protocol.
- **Vercel Node Stream (`api/chat-stream.js`)**: Because Vercel Serverless Go functions lack long-running streaming capabilities, this Node runtime bridge is used. Go handles the heavy lifting (auth, account leasing, payload generation), and Node executes the real-time SSE relaying using aligned tool-sieve semantics.

### 6. Administration & Data Storage
- **Admin API & WebUI**: Provides endpoints to manage runtime configuration, hot-reload settings, manage proxies, view logs, and troubleshoot connections via a React SPA.
- **History Tracking (`internal/chathistory`, `internal/responsehistory`)**: Optional server-side conversation history persistence and raw upstream response archiving for session tracking and development debugging.
