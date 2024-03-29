# 🦜️🔗 LangChain + Next.js Document QA Bot

This projects scaffolds LangChain.js + Next.js. It showcases how to use and combine LangChain modules for
a
Document QA bot by parsing pdfs:

Most of them use Vercel's [AI SDK](https://github.com/vercel-labs/ai) to stream tokens to the client and display the
incoming messages.

You can check out a hosted version of this repo here: https://nextjs-langchain-chatbot.vercel.app

## 🚀 Getting Started

First, clone this repo and download it locally.

Next, you'll need to set up environment variables in your repo's `.env.local` file. Copy the `.env.example` file
to `.env.local`.
To start with the basic examples, you'll just need to add your OpenAI API key.

Next, install the required packages using your preferred package manager (e.g. `yarn`).

Now you're ready to run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result! Ask the bot something and
you'll see a streamed response:

![A streaming conversation between the user and the AI](/public/images/chat-conversation.png)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Backend logic lives in `app/api/chat/route.ts`. From here, you can change the prompt and model, or add other modules and
logic.

## 🐶 Retrieval

The retrieval examples both use Supabase as a vector store. However, you can swap in
[another supported vector store](https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/) if
preferred by changing
the code under `app/api/retrieval/ingest/route.ts`, `app/api/chat/retrieval/route.ts`,
and `app/api/chat/retrieval_agents/route.ts`.

For Supabase,
follow [these instructions](https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase) to
set up your
database, then get your database URL and private key and paste them into `.env.local`.

You can then switch to the `Retrieval` and `Retrieval Agent` examples. The default document text is pulled from the
LangChain.js retrieval
use case docs, but you can change them to whatever text you'd like.

For a given text, you'll only need to press `Upload` once. Pressing it again will re-ingest the docs, resulting in
duplicates.
You can clear your Supabase vector store by navigating to the console and running `DELETE FROM docuemnts;`.

After splitting, embedding, and uploading some text, you're ready to ask questions!

![A streaming conversation between the user and an AI retrieval chain](/public/images/retrieval-chain-conversation.png)

![A streaming conversation between the user and an AI retrieval agent](/public/images/retrieval-agent-conversation.png)

For more info on retrieval chains, [see this page](https://js.langchain.com/docs/use_cases/question_answering/).
The specific variant of the conversational retrieval chain used here is composed using LangChain Expression Language,
which you can
[read more about here](https://js.langchain.com/docs/guides/expression_language/cookbook). This chain example will also
return cited sources
via header in addition to the streaming response.

For more info on retrieval
agents, [see this page](https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents).

## 📦 Bundle size

The bundle size for LangChain itself is quite small. After compression and chunk splitting, for the RAG use case
LangChain uses 37.32 KB of code space (as of [@langchain/core 0.1.15](https://npmjs.com/package/@langchain/core)), which
is less than 4% of the total Vercel free tier edge function alottment of 1 MB:

This package has [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) set up by default - you
can explore the bundle size interactively by running:

```bash
$ ANALYZE=true yarn build
```

## 📚 Learn More

The example chain in the `app/api/chat/retrieval/route.ts` file uses
[LangChain Expression Language](https://js.langchain.com/docs/guides/expression_language/interface) to
compose different LangChain modules together. You can integrate other retrievers, agents, preconfigured chains, and more
too, though keep in mind
`HttpResponseOutputParser` is meant to be used directly with model output.

To learn more about what you can do with LangChain.js, check out the docs here:

- https://js.langchain.com/docs/
