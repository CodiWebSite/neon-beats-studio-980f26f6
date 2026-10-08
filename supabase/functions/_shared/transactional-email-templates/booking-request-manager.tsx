import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string; email?: string; phone?: string; eventType?: string; eventDate?: string
  location?: string; guests?: string; budget?: string; company?: string; message?: string
}

const Row = ({ label, value }: { label: string; value?: string }) =>
  value ? (<Text style={row}><span style={lbl}>{label}:</span> {value}</Text>) : null

const Email = (p: Props) => (
  <Html lang="ro" dir="ltr">
    <Head />
    <Preview>Cerere nouă de rezervare de la {p.name || 'un client'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Cerere nouă de rezervare</Heading>
        <Text style={text}>Un client a completat formularul de pe djfunkyevents.ro.</Text>
        <Hr style={hr} />
        <Section>
          <Row label="Nume" value={p.name} />
          <Row label="Email" value={p.email} />
          <Row label="Telefon" value={p.phone} />
          <Row label="Tip eveniment" value={p.eventType} />
          <Row label="Data evenimentului" value={p.eventDate} />
          <Row label="Locație" value={p.location} />
          <Row label="Număr invitați" value={p.guests} />
          <Row label="Buget" value={p.budget} />
          <Row label="Companie" value={p.company} />
        </Section>
        {p.message && (<><Hr style={hr} /><Text style={lbl}>Mesaj:</Text><Text style={text}>{p.message}</Text></>)}
        <Hr style={hr} />
        <Text style={footer}>Poți răspunde direct clientului din acest email. Cererea apare și în /admin.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Cerere nouă de rezervare — ${d.name || 'client'}${d.eventType ? ` (${d.eventType})` : ''}`,
  displayName: 'Notificare cerere rezervare (manager)',
  to: 'manager@djfunkyevents.ro',
  previewData: { name: 'Ana Popescu', email: 'ana@example.com', phone: '+40 700 000 000', eventType: 'Nuntă', eventDate: '2026-06-14', location: 'București', guests: '150', budget: '2000 EUR', message: 'Bună! Am dori DJ pentru nunta noastră.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Montserrat, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontFamily: 'Playfair Display, Georgia, serif', color: '#8a6d2f', fontSize: '24px', margin: '0 0 12px' }
const text = { color: '#222222', fontSize: '14px', lineHeight: '22px', whiteSpace: 'pre-wrap' as const }
const row = { color: '#222222', fontSize: '14px', margin: '4px 0' }
const lbl = { color: '#8a6d2f', fontWeight: 600 }
const hr = { borderColor: '#e6d9b8', margin: '16px 0' }
const footer = { color: '#777777', fontSize: '12px' }
