import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string; eventType?: string; eventDate?: string
  location?: string; guests?: string; budget?: string; message?: string
}

const Row = ({ label, value }: { label: string; value?: string }) =>
  value ? (<Text style={row}><span style={lbl}>{label}:</span> {value}</Text>) : null

const Email = (p: Props) => (
  <Html lang="ro" dir="ltr">
    <Head />
    <Preview>Am primit cererea ta de rezervare — DJ Funky Events</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Cererea ta a fost primită</Heading>
        <Text style={text}>{p.name ? `Bună, ${p.name}!` : 'Bună!'}</Text>
        <Text style={text}>
          Îți confirmăm că am primit cererea ta de rezervare. Solicitarea a ajuns direct la
          managementul DJ Funky (Izabela Stoica) și vei fi contactat(ă) în cel mai scurt timp
          pentru detalii și ofertă.
        </Text>
        <Hr style={hr} />
        <Text style={lbl}>Rezumatul cererii tale:</Text>
        <Section>
          <Row label="Tip eveniment" value={p.eventType} />
          <Row label="Data evenimentului" value={p.eventDate} />
          <Row label="Locație" value={p.location} />
          <Row label="Număr invitați" value={p.guests} />
          <Row label="Buget" value={p.budget} />
        </Section>
        {p.message && (<><Text style={lbl}>Mesajul tău:</Text><Text style={text}>{p.message}</Text></>)}
        <Hr style={hr} />
        <Text style={text}>
          Pentru urgențe ne poți contacta direct:<br />
          Email: <Link href="mailto:manager@djfunkyevents.ro" style={link}>manager@djfunkyevents.ro</Link><br />
          Telefon / WhatsApp: <Link href="tel:+40769291604" style={link}>+40 769 291 604</Link>
        </Text>
        <Hr style={hr} />
        <Text style={footer}>DJ Funky Events — DJ • Producer • Remixer · djfunkyevents.ro</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Am primit cererea ta de rezervare — DJ Funky Events',
  displayName: 'Confirmare cerere rezervare (client)',
  previewData: { name: 'Ana Popescu', eventType: 'Nuntă', eventDate: '2026-06-14', location: 'București', guests: '150', budget: '2000 EUR', message: 'Bună! Am dori DJ pentru nunta noastră.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Montserrat, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { fontFamily: 'Playfair Display, Georgia, serif', color: '#8a6d2f', fontSize: '24px', margin: '0 0 12px' }
const text = { color: '#222222', fontSize: '14px', lineHeight: '22px', whiteSpace: 'pre-wrap' as const }
const row = { color: '#222222', fontSize: '14px', margin: '4px 0' }
const lbl = { color: '#8a6d2f', fontWeight: 600 }
const hr = { borderColor: '#e6d9b8', margin: '16px 0' }
const link = { color: '#8a6d2f' }
const footer = { color: '#777777', fontSize: '12px' }
