import { NextResponse } from 'next/server';
import { JBDDocument } from '../../components/JBDocument';
import { renderToStream } from '@react-pdf/renderer';

export async function POST(req) {
  const body = await req.json();
  const pdfStream = await renderToStream(<JBDDocument data={body} />);
  return new NextResponse(pdfStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=Rig_JBD.pdf'
    }
  });
}