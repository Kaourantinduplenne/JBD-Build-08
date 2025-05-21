import { JBDDocument } from '../../components/JBDocument';
import { renderToStream } from '@react-pdf/renderer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const body = req.body;
  const pdfStream = await renderToStream(<JBDDocument data={body} />);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=Rig_JBD.pdf');
  pdfStream.pipe(res);
}
