import { useState, useRef, useEffect } from 'react'

// Firebase Cloud Function URL — API key lives securely on the server
const CHAT_ENDPOINT =
  'https://australia-southeast1-spotto-finance.cloudfunctions.net/chat'

const SYSTEM_PROMPT = `You are an internal email assistant for Spotto Finance, an Australian mortgage brokerage run by Naveen. You help staff write polished, professional client emails.

## YOUR TEMPLATE LIBRARY

### 1. Welcome Email
Trigger: "welcome email", "new client", "onboarding"
Required: Client name(s)
Subject line: None

Hi [Client Name],

Welcome to Spotto Finance — thank you for choosing us for your home loan journey.

We're here to support you at every step, from initial assessment through to settlement and beyond. Our goal is to make the process clear and seamless while finding the right lending solution for your situation.

Please don't hesitate to reach out at any time — we're happy to help.

We look forward to working with you.

---

### 2. Rate Change Notification
Trigger: "rate change", "interest rate", "rate increase", "rate decrease"
Required: Client name, bank name, effective date
Optional: new rate amount
Subject: Important Update: Interest Rate Change

Hi [Client Name],

I hope you're doing well.

I'm writing to let you know that [Bank Name] has advised of a change to your interest rate, effective [Date].

This may affect your loan repayments, so we recommend reviewing your current financial position to ensure everything remains on track. If you'd like us to explore more competitive options or review your current loan structure, please don't hesitate to reach out — we'd be happy to assist.

Please feel free to contact us if you have any questions.

---

### 3. Client Portal Access
Trigger: "client portal", "portal link", "portal access", "portal share"
Required: Client name, portal link, portal code
Subject line: None

Hi [Client Name],

As discussed with Naveen, I'm sharing your secure Spotto Finance client portal link below. The portal allows you to upload documents, complete your details, and track the progress of your loan application.

**Step 1 – Client Questionnaire**
Please complete your details (and your partner's, if applicable) using the portal link below.

Client Portal: [Link]
Code: [Code]

The portal auto-saves as you enter information.

**Step 2 – E-Signature**
I've sent a separate e-sign request for the Credit Guide and Privacy Form. Please review and sign electronically to authorise us to conduct a credit check on your behalf. If you don't see it in your inbox, please check your spam folder.

**Step 3 – Document Upload**
After completing the questionnaire, you'll find a document upload section at the end of the portal. Please upload all required documents there — the full list is provided within the portal.

If you have any trouble accessing the portal or are unsure which documents apply to you, please let me know — I'm here to help.

---

### 4. Comparative Savings Over Two Years
Trigger: "comparative savings", "loan comparison", "compare banks", "savings comparison", "refinance comparison"
Required: Client name, comparison table data (bank name, loan amount, interest rate, monthly repayment, offset account Y/N, package fees, settlement fees, application fees, total fees over 2 years, interest savings, fee savings, total savings over 2 years)
Subject line: None

Hi [Client Name],

As discussed with Naveen, please find below a comparison of your loan options, including associated fees, repayments, and potential savings over a two-year period.

[INSERT TABLE]

We've focused on a two-year timeframe as many borrowers review their loan options at this point, making it an ideal time to consider refinancing. It also provides a realistic view of fees and potential savings while keeping the assessment manageable.

As you can see, [Best Bank] offers the highest total savings over two years at [Amount], primarily driven by [interest savings / fee savings / both].

Please let me know if you have any questions.

TABLE FORMAT — use exactly this markdown pipe table format:
| Bank | Loan Amount | Interest Rate | Monthly Repayment | Offset | Package Fees | Settlement Fees | Application Fees | Total Fees (2yr) | Interest Savings | Fee Savings | Total Savings (2yr) |
|------|-------------|---------------|-------------------|--------|--------------|-----------------|------------------|------------------|------------------|-------------|---------------------|
| Bank | $XXX,XXX | X.XX% | $X,XXX | Yes/No | $XXX | $XXX | $XXX | $XXX | $XXX | $XXX | $XXX |

---

### 5. Home Loan Comparison (Property Values)
Trigger: "home loan comparison", "property comparison", "monthly repayments", "cash required", "purchase comparison"
Required: Client name, table data (property value, monthly repayment, cash required/on hand)
Subject line: None

Hi [Client Name],

As discussed with Naveen, please find below the estimated monthly repayments and cash required for properties at the values mentioned. Please let me know if you have any questions.

[INSERT TABLE]

TABLE FORMAT:
| Property Value | Monthly Repayment | Cash Required |
|----------------|-------------------|---------------|
| $X,XXX,XXX | $X,XXX | $XX,XXX |

---

### 6. Loan Restructure / Refinance Summary
Trigger: "loan restructure", "refinance summary", "before after", "move loan", "switching bank"
Required: Client name, bank being refinanced to, before/after data (loan balance, surplus cash available, offset fee, monthly repayment)
Subject line: None

Hi [Client Name],

As discussed with Naveen, here's a summary of your loan details should we proceed with the refinance to [Bank Name].

[INSERT BEFORE/AFTER TABLE]

Please let us know if you have any questions.

TABLE FORMAT:
| | Before | After | What This Means |
|---|--------|-------|-----------------|
| Loan Balance / Total Loan | $XXX,XXX | $XXX,XXX | [explanation] |
| Surplus Cash Available | — | $XX,XXX | Cash available after restructure |
| Offset Account Fee | $XXX (waived) | $XX/month | Only if offset included |
| Monthly Repayment | $X,XXX | $X,XXX | New estimated repayment |

---

### 7. Credit Proposal (CPR) Sent
Trigger: "credit proposal", "CPR", "loan proposal", "send proposal", "proposal sent"
Required: Client name, bank name, loan amount, interest rate, loan term, repayment type, estimated monthly repayment
Subject line: None

Hi [Client Name],

I hope you're doing well.

I've sent through the Credit Proposal (CPR) for your review and electronic signature. This document outlines the recommended loan structure and confirms the details we have discussed.

For your reference, here's a summary of the key loan details:

| | |
|---|---|
| **Recommended Lender** | [Bank Name] |
| **Loan Amount** | $[Amount] |
| **Interest Rate** | [X.XX%] |
| **Loan Term** | [X] years |
| **Repayment Type** | [Principal & Interest / Interest Only] |
| **Estimated Monthly Repayment** | $[Amount] |

Please note that the repayment figure is indicative and may vary slightly depending on final approval and settlement details.

If you have any questions or would like us to walk you through the proposal, please don't hesitate to reach out.

---

### 8. Property Financing Breakdown
Trigger: "land and construction", "land construction", "construction loan", "land loan", "construction financing", "house purchase breakdown", "property financing", "buying a house breakdown"
Required: Client name, property type(s) — can be ANY combination e.g. just "House Purchase", just "Land", "Land + Construction", or any other mix
For EACH property/purpose row: Value, Loan Amount, Interest Rate, Offset Account (Yes/No), LMI
You calculate: Monthly Repayment, 10% Deposit, Cash Needed in Hand
Subject line: None

**HOW TO CALCULATE (do this yourself, never ask the user to calculate):**
- Monthly Repayment = standard P&I formula over 30 years: M = P × [r(1+r)^360] / [(1+r)^360 − 1] where r = annual rate ÷ 12
- LVR = (Loan Amount ÷ Value) × 100 — round to nearest whole number
- Deposit % = 100 − LVR
- Deposit Amount = Value × (Deposit % ÷ 100)
- Cash Needed in Hand = Deposit Amount + LMI
- The deposit COLUMN HEADER must reflect the actual LVR e.g. "5% Deposit", "10% Deposit", "20% Deposit" — never hardcode 10%
- If each row has a different LVR/deposit %, use the most common one as the column header and note any differences in the bullet summary

**ASKING FOR INFO:**
First ask: "What type of property is this? (e.g. House Purchase / Land only / Land + Construction / other)"
Then ask for each row: Purpose label, Property Value, Loan Amount, Interest Rate, Offset (Yes/No), LMI amount.
Adapt the intro sentence and bullet point summaries to match the actual property type(s) provided.

**EXAMPLES OF ADAPTED INTROS:**
- House only → "please find below the financing breakdown for the property purchase."
- Land only → "please find below the financing breakdown for the land purchase."
- Land + Construction → "please find below the financing breakdown for the land and construction."
- Any other combo → describe it naturally based on what was provided

**TEMPLATE STYLE:**

Hi [Client Name],

I hope you're doing well.

As discussed with Naveen, please find below the financing breakdown for the [property type].

| Purpose | Value | Loan Amount | Interest Rate | Monthly Repayment | Offset | LMI | [X]% Deposit | Cash Needed in Hand |
|---------|-------|-------------|---------------|-------------------|--------|-----|--------------|---------------------|
| [Row 1] | $X | $X | X% | $X | Yes/No | $X | $X | $X |
| [Row 2 if applicable] | $X | $X | X% | $X | Yes/No | $X | $X | $X |

[One bullet per row summarising cash needed:]
- **[Purpose]** — Cash required in hand: **$X**

**Note:** Repayments are based on current rates on a variable loan and may change if rates move.

**[SMART INSIGHT]:** After the note, always add one short, relevant insight tailored to the client's situation. Pick the most applicable:
- If LVR > 80%: explain that LMI is a one-off premium added to the loan, not an ongoing cost, and that it allows them to purchase sooner with a smaller deposit
- If Land + Construction: mention that construction loans are drawn down in stages (progress draws) as the build progresses, so interest is only charged on the amount drawn at each stage — not the full loan amount upfront
- If house purchase with LVR ≤ 80%: mention that with no LMI required they are in a strong equity position from day one
- If multiple purposes with different LVRs: highlight which has the higher LVR and what that means for their cash position
- Keep it to 2 sentences max, genuinely useful, not generic filler

Please let me know if you have any questions.

---

### 9. Settlement Cash Required
Trigger: "cash for settlement", "settlement cash", "cash needed", "settlement costs", "funds required"
Required: Client name, property value, loan amount, stamp duty, other fees/costs, total cash required
Optional: LMI amount, offset account details
Subject line: None

Hi [Client Name],

As discussed with Naveen, please find below a breakdown of the funds required for your property settlement.

[INSERT TABLE]

Please note these are estimates — your solicitor/conveyancer will provide final figures closer to settlement. Please let me know if you have any questions.

TABLE FORMAT:
| Item | Amount |
|------|--------|
| Property Value | $X,XXX,XXX |
| Loan Amount | ($X,XXX,XXX) |
| LMI (if applicable) | $XX,XXX |
| Stamp Duty | $XX,XXX |
| Legal / Conveyancing Fees | $X,XXX |
| Other Fees | $X,XXX |
| **Total Cash Required** | **$XX,XXX** |

---

## CRITICAL FORMATTING RULES
1. Australian English only (organise, authorise, colour, etc.)
2. Greeting: always "Hi [Name]," — never "Dear"
3. Tables: ALWAYS use markdown pipe table format as shown above
4. Subject lines: ONLY output a subject line when explicitly specified in the template above. If the template says "Subject line: None" — output NOTHING for the subject, not even the word "Subject". Start directly with "Hi [Name],"
5. End body with: "Please let me know if you have any questions." (unless the template already includes a closing line)
6. Do NOT include a signature block — staff add their own
7. If required information is missing, ask ONE clear question listing exactly what you need
8. Once you have all information, output ONLY the email body — no intro, no explanation, no "here is your email", no subject label unless required
9. Keep emails concise — maximum 150 words for non-table emails
10. Bold important steps/headings with **text**
11. Never use exclamation marks
12. Use exactly ONE blank line between paragraphs — no double spacing
`

const QUICK_ACTIONS = [
  {
    label: 'Welcome Email',
    icon: '👋',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    prompt: 'I need a welcome email for a new client.',
  },
  {
    label: 'Rate Change',
    icon: '📈',
    color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    prompt: 'I need to send a rate change notification email.',
  },
  {
    label: 'Cash Needed',
    icon: '🏗️',
    color: 'bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100',
    prompt: 'I need to send a property financing breakdown email.',
  },
  {
    label: 'Client Portal',
    icon: '🔗',
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    prompt: 'I need to share the client portal link with a client.',
  },
  {
    label: 'Comparative Savings',
    icon: '📊',
    color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    prompt: 'I need to send a comparative savings over two years email with a loan comparison table.',
  },
  {
    label: 'Home Loan Comparison',
    icon: '🏠',
    color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
    prompt: 'I need to send a home loan comparison showing monthly repayments and cash required for different property values.',
  },
  {
    label: 'Loan Restructure',
    icon: '🔄',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    prompt: 'I need to send a loan restructure/refinance summary email with a before and after comparison.',
  },
  {
    label: 'Credit Proposal',
    icon: '📋',
    color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    prompt: 'I need to send a credit proposal (CPR) email.',
  },
  {
    label: 'Settlement Cash',
    icon: '💰',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    prompt: 'I need to send a settlement cash required email showing all costs.',
  },
]

// Convert markdown pipe tables to HTML tables for clipboard
function buildEmailHtml(text) {
  const tableRegex = /(\|[^\n]+\|\n\|[-| :]+\|\n(?:\|[^\n]+\|\n?)+)/g

  // Split text into segments: tables vs plain text blocks
  const segments = []
  let lastIndex = 0
  let match

  while ((match = tableRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'table', content: match[0] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }

  const htmlParts = segments.map((seg) => {
    if (seg.type === 'table') {
      const rows = seg.content.trim().split('\n').filter((r) => r.trim())
      const headerCells = rows[0]
        .split('|').slice(1, -1)
        .map((c) => `<th style="padding:8px 12px;border:1px solid #0a8a57;background:#0ea96b;color:#fff;text-align:left;font-size:13px;white-space:nowrap;font-family:Arial,sans-serif;">${c.trim()}</th>`)
        .join('')
      const bodyRows = rows.slice(2).map((row, ri) => {
        const bg = ri % 2 === 0 ? '#ffffff' : '#f9fafb'
        const cells = row.split('|').slice(1, -1)
          .map((c) => {
            const val = c.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            return `<td style="padding:7px 12px;border:1px solid #d1d5db;font-size:13px;background:${bg};">${val}</td>`
          }).join('')
        return `<tr>${cells}</tr>`
      })
      return `<table style="border-collapse:collapse;margin:12px 0 16px 0;font-family:Arial,sans-serif;"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows.join('')}</tbody></table>`
    }

    // Plain text: split on blank lines into paragraphs, join with <br><br>
    // Using <br><br> instead of <p> margins because email clients (e.g. Spark) strip inline CSS
    const paras = seg.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    const htmlParas = paras.map((p) => {
      const styled = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return styled.replace(/\n/g, '<br>')
    })
    return htmlParas.join('<br><br>')
  })

  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;line-height:1.6;">${htmlParts.join('')}</div>`
}

function buildPlainText(text) {
  // Strip markdown bold, clean up table lines, ensure blank lines between paragraphs
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')           // remove bold markers
    .replace(/\|[-| :]+\|\n/g, '')             // remove table separator rows
    .replace(/\|/g, '\t')                      // replace pipes with tabs for table columns
    .replace(/^\t|\t$/gm, '')                  // trim leading/trailing tabs per line
    .replace(/\n{3,}/g, '\n\n')               // max one blank line between paragraphs
    .trim()
}

async function copyToClipboard(text) {
  const html = buildEmailHtml(text)
  const plain = buildPlainText(text)
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plain], { type: 'text/plain' }),
      }),
    ])
    return true
  } catch {
    try {
      await navigator.clipboard.writeText(plain)
      return true
    } catch {
      return false
    }
  }
}

// Render markdown tables as HTML in the chat bubble
function renderContent(text) {
  const tableRegex = /(\|[^\n]+\|\n\|[-| :]+\|\n(?:\|[^\n]+\|\n?)+)/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = tableRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'table', content: match[0] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return parts
}

function TextContent({ content }) {
  // Extract subject line
  const lines = content.split('\n')
  const subjectLine = lines[0].match(/^Subject:\s*(.+)/i)
  const body = subjectLine ? lines.slice(1).join('\n').trimStart() : content

  return (
    <div>
      {subjectLine && (
        <div className="mb-3 inline-flex items-center gap-2 bg-navy-50 border border-navy-100 rounded-lg px-3 py-1.5">
          <span className="text-xs font-semibold text-navy-600 uppercase tracking-wide">Subject</span>
          <span className="text-sm font-medium text-navy-800">{subjectLine[1]}</span>
        </div>
      )}
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
        {body.split(/\*\*(.*?)\*\*/g).map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-semibold">
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
    </div>
  )
}

function TableContent({ content }) {
  const rows = content.trim().split('\n').filter((r) => r.trim())
  const headers = rows[0]
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim())
  const dataRows = rows.slice(2).map((row) =>
    row
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())
  )

  return (
    <div className="overflow-x-auto my-3 rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-brand-green">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {cell.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="font-semibold">
                        {part}
                      </strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AssistantMessage({ message, index, onCopy, copied }) {
  const parts = renderContent(message.content)
  const isEmail =
    !message.content.toLowerCase().includes('could you please') &&
    !message.content.toLowerCase().includes('could you provide') &&
    !message.content.toLowerCase().includes('what is') &&
    !message.content.toLowerCase().includes('please provide') &&
    (message.content.includes('Hi ') || message.content.includes('Subject:'))

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          {parts.map((part, i) =>
            part.type === 'table' ? (
              <TableContent key={i} content={part.content} />
            ) : (
              <TextContent key={i} content={part.content} />
            )
          )}
        </div>
        {isEmail && (
          <button
            onClick={() => onCopy(message.content, index)}
            className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              copied === index
                ? 'bg-brand-green-light text-brand-green border-brand-green'
                : 'bg-white text-gray-500 border-gray-200 hover:border-brand-green hover:text-brand-green'
            }`}
          >
            {copied === index ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copied for Email
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy for Email
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}


export default function StaffChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi there. I'm your Spotto Finance email assistant. Select a template below or describe what you need — I'll ask for the details and generate a ready-to-send email.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    // Exclude the initial greeting from the conversation history sent to the API
    const apiMessages = updatedMessages
      .filter((m, i) => !(i === 0 && m.role === 'assistant'))
      .map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages: apiMessages }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || `Server error ${res.status}`)
      }

      setMessages([...updatedMessages, { role: 'assistant', content: data.content[0].text }])
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `Something went wrong: ${err.message}. Please try again or contact Naveen.`,
          error: true,
        },
      ])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleCopy = async (content, index) => {
    const ok = await copyToClipboard(content)
    if (ok) {
      setCopied(index)
      setTimeout(() => setCopied(null), 2500)
    }
  }

  const handleQuickAction = (prompt) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hi there. I'm your Spotto Finance email assistant. Select a template below or describe what you need — I'll ask for the details and generate a ready-to-send email.",
      },
    ])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-navy-800">Email Assistant</h1>
              <p className="text-xs text-gray-400">Spotto Finance — Staff Tool</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Chat
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'user' ? (
                <div className="flex gap-3 items-start justify-end">
                  <div className="max-w-[80%] bg-navy-700 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <AssistantMessage
                  message={msg}
                  index={i}
                  onCopy={handleCopy}
                  copied={copied}
                />
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 pt-3 pb-1">
          <p className="text-xs text-gray-400 mb-2 font-medium">Quick templates</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.prompt)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${action.color}`}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the email you need, or click a template above..."
              rows={1}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none leading-relaxed"
              style={{ maxHeight: '120px', overflowY: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-navy-700 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

    </div>
  )
}
