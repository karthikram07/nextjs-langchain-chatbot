import { ChatWindow } from '@/components/ChatWindow';
import { GuideInfoBox } from '@/components/guide/GuideInfoBox';

export default function Home() {
  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="text-l">
          🔗
          <span className="ml-2">
            This project showcases how to perform retrieval with a{' '}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{' '}
            chain and the Vercel{' '}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{' '}
            in a{' '}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{' '}
            project.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🪜
          <span className="ml-2">The chain works in two steps:</span>
          <ul>
            <li className="ml-4">
              1️⃣
              <span className="ml-2">
                First, it rephrases the input question into a &quot;standalone&quot; question, dereferencing pronouns
                based on the chat history.
              </span>
            </li>
            <li className="ml-4">
              2️⃣
              <span className="ml-2">
                Then, it queries the retriever for documents similar to the dereferenced question and composes an
                answer.
              </span>
            </li>
          </ul>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Upload some text, then try asking something relevant to the text. e.g.{' '}
            <code>What is a document loader?</code> below!
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );
  return (
    <ChatWindow
      endpoint="api/chat/retrieval"
      emptyStateComponent={InfoCard}
      showIngestForm={true}
      placeholder={'I\'ve got a knack for finding just what you need in a document."'}
      emoji=""
    ></ChatWindow>
  );
}
