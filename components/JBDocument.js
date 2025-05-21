import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { fontSize: 10, padding: 30, flexDirection: 'column', justifyContent: 'space-between' },
  section: { marginBottom: 10 },
  heading: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  box: { border: '1pt solid black', padding: 6, marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 8 }
});

export function JBDDocument({ data }) {
  const now = new Date().toLocaleDateString();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.heading}>Rig Job By Design</Text>
            <View style={styles.row}>
              <Text>Operation: {data.operation}</Text>
              <Text>Rig: {data.rig}</Text>
              <Text>PIC: {data.pic}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Line of Fire - Major Hazards</Text>
            <View style={styles.box}>
              <Text>{data.lofHazard}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Personnel Involved</Text>
            {data.workers.map((w, i) => (<Text key={i}>{i + 1}. {w}</Text>))}
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Task Steps</Text>
            {data.tasks.map((t, i) => (<Text key={i}>• {t.step} (By: {t.person})</Text>))}
          </View>
        </View>
        <View style={styles.footer}>
          <Text>PDF generated on {now}</Text>
        </View>
      </Page>
    </Document>
  );
}