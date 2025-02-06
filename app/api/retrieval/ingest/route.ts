// app/api/retrieval/ingest/route.ts (for Next.js 13 App Router, example)
import { NextRequest, NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';

// IMPORTANT: Adjust import paths for your exact LangChain version/install.
// For older (pre-0.0.90) versions, the loader may be under:
//   import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
// Double-check your installed version and docs.

export async function POST(req: NextRequest) {
  try {
    // Parse JSON from the request
    const body = await req.json();
    const { url } = body;
    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // Create Supabase client
    const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
    console.log('Supabase client:', client);

    // Fetch the remote PDF as a Blob
    const pdfResponse = await fetch(url);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF from: ${url}`);
    }
    const pdfBlob = await pdfResponse.blob();

    // Load the PDF into LangChain using WebPDFLoader
    const loader = new WebPDFLoader(pdfBlob);
    const docs = await loader.load();

    // Split the loaded Documents into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 256,
      chunkOverlap: 20
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // Create/extend your vector store in Supabase
    const vectorstore = await SupabaseVectorStore.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
      client,
      tableName: 'documents',
      queryName: 'match_documents'
    });

    // At this point, your data has been embedded and uploaded
    return NextResponse.json({ ok: true, message: 'PDF ingested successfully!' });
  } catch (error: any) {
    console.error('Error ingesting PDF:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
