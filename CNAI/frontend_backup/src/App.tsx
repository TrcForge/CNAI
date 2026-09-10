import CytoscapeComponent from 'react-cytoscapejs'
import type { Core } from 'cytoscape'
import { useEffect, useState } from 'react'
import LocationMap from './components/LocationMap'
import Network3D from './components/Network3D'
import Login from './login'

type Entity = {
  id: string
  label: string
  type: string
  description: string
  status: string
}

const entities: Entity[] = [
  {
    id: 'person1',
    label: 'Person A',
    type: 'Person',
    description: 'Primary investigation entity',
    status: 'Under Review',
  },
  {
    id: 'person2',
    label: 'Person B',
    type: 'Person',
    description: 'Associated person',
    status: 'Monitoring',
  },
  {
    id: 'phone1',
    label: '+91 XXXXXXX123',
    type: 'Phone',
    description: 'Communication identifier',
    status: 'Linked',
  },
  {
    id: 'vehicle1',
    label: 'GJ-01-AB-1234',
    type: 'Vehicle',
    description: 'Vehicle associated with investigation',
    status: 'Linked',
  },
  {
    id: 'case1',
    label: 'CASE-2026-0142',
    type: 'Case',
    description: 'Cross-case network investigation',
    status: 'Active',
  },
  {
    id: 'account1',
    label: 'Account-7842',
    type: 'Account',
    description: 'Financial account',
    status: 'Under Review',
  },
  {
    id: 'org1',
    label: 'Organization X',
    type: 'Organization',
    description: 'Associated organization',
    status: 'Monitoring',
  },
]

const relationships = [
  {
    id: 'r1',
    source: 'person1',
    target: 'phone1',
    label: 'USES',
  },
  {
    id: 'r2',
    source: 'person1',
    target: 'vehicle1',
    label: 'ASSOCIATED WITH',
  },
  {
    id: 'r3',
    source: 'phone1',
    target: 'case1',
    label: 'MENTIONED IN',
  },
  {
    id: 'r4',
    source: 'person1',
    target: 'person2',
    label: 'COMMUNICATES WITH',
  },
  {
    id: 'r5',
    source: 'person2',
    target: 'account1',
    label: 'LINKED TO',
  },
  {
    id: 'r6',
    source: 'account1',
    target: 'org1',
    label: 'CONNECTED TO',
  },
  {
    id: 'r7',
    source: 'person2',
    target: 'case1',
    label: 'ASSOCIATED WITH',
  },
]

type CDRRecord = {
  id: string
  caller: string
  receiver: string
  date: string
  time: string
  duration: string
  callType: string
  location: string
  linkedPerson: string
}

type FIRRecord = {
  id: string
  caseNumber: string
  person: string
  date: string
  policeStation: string
  sections: string
  incident: string
  status: string
}

type TransactionRecord = {
  id: string
  date: string
  time: string
  sender: string
  receiver: string
  account: string
  amount: string
  type: string
  status: string
}

const sampleCDRRecords: CDRRecord[] = [
  {
    id: 'CDR-2026-001',
    caller: '+91 98XXXXXX21',
    receiver: '+91 97XXXXXX43',
    date: '09 Sep 2026',
    time: '21:14',
    duration: '08:42',
    callType: 'Outgoing',
    location: 'Ahmedabad',
    linkedPerson: 'Person A',
  },
  {
    id: 'CDR-2026-002',
    caller: '+91 97XXXXXX43',
    receiver: '+91 98XXXXXX21',
    date: '09 Sep 2026',
    time: '22:03',
    duration: '04:18',
    callType: 'Incoming',
    location: 'Ahmedabad',
    linkedPerson: 'Person B',
  },
  {
    id: 'CDR-2026-003',
    caller: '+91 98XXXXXX21',
    receiver: '+91 96XXXXXX87',
    date: '08 Sep 2026',
    time: '18:42',
    duration: '12:06',
    callType: 'Outgoing',
    location: 'Gandhinagar',
    linkedPerson: 'Person A',
  },
]

const sampleFIRRecords: FIRRecord[] = [
  {
    id: 'FIR-2026-0142',
    caseNumber: 'CASE-2026-0142',
    person: 'Person A',
    date: '08 Sep 2026',
    policeStation: 'Cyber Crime Police Station',
    sections: 'IPC / IT Act — Review',
    incident: 'Suspected coordinated criminal activity involving multiple linked entities.',
    status: 'Under Investigation',
  },
  {
    id: 'FIR-2026-0138',
    caseNumber: 'CASE-2026-0138',
    person: 'Person B',
    date: '05 Sep 2026',
    policeStation: 'Ahmedabad City Police',
    sections: 'Investigation Sections',
    incident: 'Communication and association records require further verification.',
    status: 'Active',
  },
]

const sampleTransactionRecords: TransactionRecord[] = [
  {
    id: 'TXN-2026-00481',
    date: '09 Sep 2026',
    time: '20:16',
    sender: 'Account-7842',
    receiver: 'Account-9136',
    account: 'Account-7842',
    amount: '₹48,500',
    type: 'Account Transfer',
    status: 'Flagged for Review',
  },
  {
    id: 'TXN-2026-00472',
    date: '08 Sep 2026',
    time: '17:31',
    sender: 'Account-9136',
    receiver: 'Account-4471',
    account: 'Account-9136',
    amount: '₹1,25,000',
    type: 'NEFT',
    status: 'Under Review',
  },
  {
    id: 'TXN-2026-00465',
    date: '07 Sep 2026',
    time: '11:08',
    sender: 'Account-7842',
    receiver: 'Organization X',
    account: 'Account-7842',
    amount: '₹32,000',
    type: 'Account Transfer',
    status: 'Recorded',
  },
]

type Case = {
  id: string
  title: string
  status: string
  type: string
  description: string
}

const cases: Case[] = [
  {
    id: 'CASE-2026-0142',
    title: 'Cross-case network investigation',
    status: 'Active',
    type: 'Network Investigation',
    description: 'Potential connections identified across multiple entities.',
  },
  {
    id: 'CASE-2026-0138',
    title: 'Potential communication pattern',
    status: 'Under Review',
    type: 'Communication Pattern',
    description: 'Review of communication patterns and associated entities.',
  },
  {
    id: 'CASE-2026-0129',
    title: 'Historical location analysis',
    status: 'Active',
    type: 'Women Safety',
    description: 'Analysis of historical locations and incident patterns.',
  },
]
type SimilarityResult = {
  entityId: string
  entityName: string
  entityType: string
  score: number
  identity: number
  location: number
  communication: number
  financial: number
  network: number
  reason: string
  
}

type NetworkMetricSet = {
  nodes: number
  links: number
  components: number
  density: number
  averagePath: number
}

function calculateNetworkMetrics(
  nodeIds: string[],
  links: { source: string; target: string }[],
): NetworkMetricSet {
  const adjacency = new Map<string, Set<string>>()
  nodeIds.forEach((id) => adjacency.set(id, new Set()))

  links.forEach((link) => {
    if (adjacency.has(link.source) && adjacency.has(link.target)) {
      adjacency.get(link.source)?.add(link.target)
      adjacency.get(link.target)?.add(link.source)
    }
  })

  let components = 0
  const visited = new Set<string>()
  for (const start of nodeIds) {
    if (visited.has(start)) continue
    components += 1
    const queue = [start]
    visited.add(start)
    while (queue.length) {
      const current = queue.shift()!
      adjacency.get(current)?.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      })
    }
  }

  let distanceTotal = 0
  let distancePairs = 0
  for (let i = 0; i < nodeIds.length; i += 1) {
    const start = nodeIds[i]
    const distances = new Map<string, number>([[start, 0]])
    const queue = [start]
    while (queue.length) {
      const current = queue.shift()!
      adjacency.get(current)?.forEach((neighbor) => {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, distances.get(current)! + 1)
          queue.push(neighbor)
        }
      })
    }
    for (let j = i + 1; j < nodeIds.length; j += 1) {
      const distance = distances.get(nodeIds[j])
      if (distance !== undefined) {
        distanceTotal += distance
        distancePairs += 1
      }
    }
  }

  return {
    nodes: nodeIds.length,
    links: links.length,
    components,
    density: nodeIds.length > 1 ? (2 * links.length) / (nodeIds.length * (nodeIds.length - 1)) : 0,
    averagePath: distancePairs > 0 ? distanceTotal / distancePairs : 0,
  }
}

const similarityResults: SimilarityResult[] = [
  {
    entityId: 'person2',
    entityName: 'Person B',
    entityType: 'Person',
    score: 87,
    identity: 82,
    location: 81,
    communication: 92,
    financial: 76,
    network: 88,
    reason:
      'Shared communication link, common case association and overlapping network connections.',
  },
  {
    entityId: 'account1',
    entityName: 'Account-7842',
    entityType: 'Account',
    score: 74,
    identity: 68,
    location: 72,
    communication: 61,
    financial: 94,
    network: 75,
    reason:
      'Strong financial relationship and connected organizational association.',
  },
  {
    entityId: 'vehicle1',
    entityName: 'GJ-01-AB-1234',
    entityType: 'Vehicle',
    score: 69,
    identity: 71,
    location: 86,
    communication: 42,
    financial: 51,
    network: 73,
    reason:
      'Repeated association with the selected entity and overlapping location observations.',
  },
]

function App() {
  const handleLoginSuccess = (response: {
  access_token: string
  token_type?: string
  user: {
    id: string
    username: string
    role: 'ADMIN' | 'INVESTIGATOR' | 'ANALYST' | 'VIEWER'
    name?: string
  }
}) => {
  sessionStorage.setItem('access_token', response.access_token)
  sessionStorage.setItem('auth_user', JSON.stringify(response.user))

  setAuthUser(response.user)
  setAuthenticated(true)
}
  const [authenticated, setAuthenticated] = useState(
  import.meta.env.VITE_DEV_AUTH_BYPASS === 'true'
)

const [authUser, setAuthUser] = useState<{
  id: string
  username: string
  role: 'ADMIN' | 'INVESTIGATOR' | 'ANALYST' | 'VIEWER'
  name?: string
} | null>(null)
const handleLogout = () => {
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('auth_user')

  setAuthUser(null)
  setAuthenticated(false)
  setActivePage('Dashboard')
}
  
  const [activePage, setActivePage] = useState('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)
  const [entityFilter, setEntityFilter] = useState('All')
  const [caseSearchQuery, setCaseSearchQuery] = useState('')
  const [selectedEntityId, setSelectedEntityId] = useState('person1')
  const [locationEntityId, setLocationEntityId] = useState('person1')
  const [statusFilter, setStatusFilter] = useState('All')
const [caseTypeFilter, setCaseTypeFilter] = useState('All')
const [similarityType, setSimilarityType] = useState('All')
const [similarityEntityId, setSimilarityEntityId] = useState('person1')
const [similarityThreshold, setSimilarityThreshold] = useState('60')
const [disruptionEntityId, setDisruptionEntityId] = useState('person1')
const [disruptionType, setDisruptionType] = useState('Entity')
const [disruptionSimulated, setDisruptionSimulated] = useState(false)
const [evidenceQuery, setEvidenceQuery] = useState('')
const [sidebarOpen, setSidebarOpen] = useState(true)
const [profileOpen, setProfileOpen] = useState(false)
const [recordLoading, setRecordLoading] = useState(false)
const [recordError, setRecordError] = useState('')
const [cdrRecords, setCdrRecords] = useState<CDRRecord[]>(sampleCDRRecords)
const [firRecords, setFirRecords] = useState<FIRRecord[]>(sampleFIRRecords)
const [transactionRecords, setTransactionRecords] = useState<TransactionRecord[]>(sampleTransactionRecords)
const [visibleRecords, setVisibleRecords] = useState<{ cdr: boolean; fir: boolean; transactions: boolean }>({ cdr: false, fir: false, transactions: false })

const [evidenceResults, setEvidenceResults] = useState<
  {
    evidence_id: string
    similarity: number
    description: string
    actor_id: string
    case_id: string
    vehicle_id: string
    location: string
  }[]
>([])

const [evidenceLoading, setEvidenceLoading] = useState(false)
const [evidenceError, setEvidenceError] = useState('')

  const searchEvidence = async () => {
    const query = evidenceQuery.trim()

    if (!query) {
      setEvidenceResults([])
      setEvidenceError('Enter an evidence description to search.')
      return
    }

    setEvidenceLoading(true)
    setEvidenceError('')

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/evidence/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            top_k: 5,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Evidence search failed.')
      }

      const data: {
        results?: {
          evidence_id: string
          similarity: number
          description: string
          actor_id: string
          case_id: string
          vehicle_id: string
          location: string
        }[]
      } = await response.json()

      const results = data.results ?? []
      setEvidenceResults(results)

      if (results.length === 0) {
        setEvidenceError('No matching evidence records found.')
      }
    } catch (error) {
      console.error(error)
      setEvidenceResults([])
      setEvidenceError(
        'Unable to connect to the evidence analysis backend.',
      )
    } finally {
      setEvidenceLoading(false)
    }
  }

  const loadRecordType = async (recordType: 'cdr' | 'fir' | 'transactions') => {
    setRecordLoading(true)
    setRecordError('')
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    if (!baseUrl) { setRecordLoading(false); return }
    const token = sessionStorage.getItem('access_token')
    const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    const endpointMap = { cdr: { url: '/cdr', label: 'CDR' }, fir: { url: '/fir', label: 'FIR' }, transactions: { url: '/transactions', label: 'Transactions' } } as const
    const { url, label } = endpointMap[recordType]
    try {
      const response = await fetch(`${baseUrl}${url}`, { headers })
      if (!response.ok) throw new Error(`${label} extraction failed`)
      const data = await response.json()
      const records = Array.isArray(data) ? data : (data.records ?? [])
      if (recordType === 'cdr') setCdrRecords(records as CDRRecord[])
      else if (recordType === 'fir') setFirRecords(records as FIRRecord[])
      else setTransactionRecords(records as TransactionRecord[])
    } catch (error) {
      console.error(error)
      setRecordError(`Unable to extract ${label} records. Showing the latest available records.`)
    } finally { setRecordLoading(false) }
  }

  const [intelligenceOpen, setIntelligenceOpen] = useState(true)
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [safetyOpen, setSafetyOpen] = useState(false)

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      entityFilter === 'All' || entity.type === entityFilter

    return matchesSearch && matchesFilter
  })
  const filteredCases = cases.filter((caseItem) => {
  const query = caseSearchQuery.trim().toLowerCase()

  const matchesSearch =
    query === '' ||
    caseItem.id.toLowerCase().includes(query) ||
    caseItem.title.toLowerCase().includes(query) ||
    caseItem.description.toLowerCase().includes(query) ||
    caseItem.type.toLowerCase().includes(query) ||
    caseItem.status.toLowerCase().includes(query)

  const matchesStatus =
    statusFilter === 'All' ||
    caseItem.status === statusFilter

  const matchesType =
    caseTypeFilter === 'All' ||
    caseItem.type === caseTypeFilter

  return matchesSearch && matchesStatus && matchesType
})

  const globalSearchResults = [
    ...entities
      .filter((entity) => entity.type === 'Person')
      .filter((entity) => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return false

        return (
          entity.label.toLowerCase().includes(query) ||
          entity.type.toLowerCase().includes(query) ||
          entity.id.toLowerCase().includes(query)
        )
      })
      .map((entity) => ({
        kind: 'entity' as const,
        id: entity.id,
        label: entity.label,
        type: entity.type,
      })),
    ...cases
      .filter((caseItem) => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return false

        return (
          caseItem.id.toLowerCase().includes(query) ||
          caseItem.title.toLowerCase().includes(query) ||
          caseItem.type.toLowerCase().includes(query) ||
          caseItem.description.toLowerCase().includes(query)
        )
      })
      .map((caseItem) => ({
        kind: 'case' as const,
        id: caseItem.id,
        label: caseItem.id,
        type: caseItem.title,
      })),
  ]

  const selectedEntity =
    entities.find((entity) => entity.id === selectedEntityId) || entities[0]

  const selectedRelationships = relationships.filter(
    (relationship) =>
      relationship.source === selectedEntity.id ||
      relationship.target === selectedEntity.id,
  )

  const networkElements = [
    ...filteredEntities.map((entity) => ({
      data: {
        id: entity.id,
        label: entity.label,
        type: entity.type,
      },
    })),

    ...relationships
      .filter(
        (relationship) =>
          filteredEntities.some(
            (entity) => entity.id === relationship.source,
          ) &&
          filteredEntities.some(
            (entity) => entity.id === relationship.target,
          ),
      )
      .map((relationship) => ({
        data: {
          id: relationship.id,
          source: relationship.source,
          target: relationship.target,
          label: relationship.label,
        },
      })),
  ]

  const openEntity = (id: string) => {
    setSelectedEntityId(id)
  }
  const filteredSimilarityResults = similarityResults.filter((result) => {
  if (similarityType === 'All') {
    return result.score >= Number(similarityThreshold)
  }

  const value =
    similarityType === 'Identity'
      ? result.identity
      : similarityType === 'Location'
        ? result.location
        : similarityType === 'Communication'
          ? result.communication
          : similarityType === 'Financial'
            ? result.financial
            : result.network

  return value >= Number(similarityThreshold)
})

  const baselineNodeIds = entities.map((entity) => entity.id)
  const baselineLinks = relationships.map((relationship) => ({
    source: relationship.source,
    target: relationship.target,
  }))
  const disruptionNodeIds =
    disruptionType === 'Entity'
      ? baselineNodeIds.filter((id) => id !== disruptionEntityId)
      : baselineNodeIds
  const disruptionLinks = baselineLinks.filter((link, index) => {
    if (disruptionType === 'Relationship') {
      return relationships[index].id !== disruptionEntityId
    }
    return link.source !== disruptionEntityId && link.target !== disruptionEntityId
  })
  const baselineMetrics = calculateNetworkMetrics(baselineNodeIds, baselineLinks)
  const disruptedMetrics = calculateNetworkMetrics(disruptionNodeIds, disruptionLinks)

  const formatMetric = (value: number) => value.toFixed(2)
  const pathDelta = disruptedMetrics.averagePath - baselineMetrics.averagePath
  const linkDelta = disruptedMetrics.links - baselineMetrics.links
  const componentDelta = disruptedMetrics.components - baselineMetrics.components

if (!authenticated) {
  return <Login onLoginSuccess={handleLoginSuccess} />
}

  return (
    <div className="cna-police-theme min-h-screen text-slate-900">

      <style>{`
        html, body, #root {
          width: 100% !important;
          min-height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body {
          overflow-x: hidden !important;
          background: #eef5fc !important;
        }
        .cna-police-theme {
          width: 100% !important;
          min-height: 100vh;
          position: relative;
          display: block !important;
          overflow-x: hidden;
          background:
            linear-gradient(180deg, #eef5fc 0%, #f7fbff 42%, #eef5fc 100%);
        }
        .cna-police-theme::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: .24;
          background-image:
            linear-gradient(rgba(22,63,103,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(22,63,103,.025) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }
        .cna-police-theme > * { position: relative; z-index: 1; }

        /* Keep the sidebar fixed without changing the existing police theme. */
        .cna-police-theme > aside {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 50 !important;
        }

        .cna-police-theme > main {
          position: relative !important;
          top: 0 !important;
          z-index: 1 !important;
        }

        .cna-police-theme .bg-white {
          background: rgba(255,255,255,.90) !important;
          backdrop-filter: blur(7px);
        }
        .cna-police-theme .bg-slate-50 { background: rgba(244,249,255,.82) !important; }
        .cna-police-theme .border-slate-200 { border-color: #d4e0ed !important; }
        .cna-police-theme .border-slate-300 { border-color: #c5d5e5 !important; }
        .cna-police-theme .text-slate-900 { color: #102b4a !important; }
        .cna-police-theme .text-slate-800 { color: #183a60 !important; }
        .cna-police-theme .text-slate-700 { color: #365777 !important; }
        .cna-police-theme .text-slate-600 { color: #527292 !important; }
        .cna-police-theme .text-slate-500 { color: #6685a3 !important; }

        .cna-police-theme aside {
          background:
            radial-gradient(circle at 52% 68%, rgba(22,92,160,.34), transparent 31%),
            linear-gradient(180deg, #061a31 0%, #0b2b4c 53%, #071b31 100%) !important;
          border-right-color: rgba(166,207,242,.18) !important;
          box-shadow: 10px 0 34px rgba(5,31,56,.18);
        }
        .cna-police-theme aside .text-blue-50 { color: #edf6ff !important; }
        .cna-police-theme aside .text-blue-200 { color: #a9c8e7 !important; }
        .cna-police-theme aside .bg-blue-500 {
          background: linear-gradient(90deg, #214d9f, #17469b) !important;
          box-shadow: inset 3px 0 0 rgba(124,169,255,.85), 0 5px 18px rgba(15,67,153,.24);
        }
        .cna-police-theme aside .hover\\:bg-white\\/10:hover { background: rgba(255,255,255,.075) !important; }
        .cna-police-theme aside .border-white\\/15 { border-color: rgba(193,222,246,.18) !important; }
        .cna-police-theme aside .border-white\\/20 { border-color: rgba(193,222,246,.23) !important; }
        .cna-police-theme aside .bg-white\\/10 { background: rgba(255,255,255,.065) !important; }

        .cna-police-theme main > .mb-6 {
          border-color: #d2dfed !important;
          background: rgba(248,252,255,.94) !important;
          box-shadow: 0 8px 24px rgba(34,72,110,.08);
          backdrop-filter: blur(10px);
        }
        .cna-police-theme input::placeholder { color: #6685a3 !important; }

        .cna-police-theme section.rounded-xl,
        .cna-police-theme section.rounded-lg {
          box-shadow: 0 7px 22px rgba(31,69,108,.055);
        }
        .cna-police-theme .bg-blue-50 { background: #eef6ff !important; }
        .cna-police-theme .bg-blue-100 { background: #dcecff !important; }
        .cna-police-theme .text-blue-900 { color: #123d70 !important; }
        .cna-police-theme .text-blue-800 { color: #2e5d89 !important; }
        .cna-police-theme .text-blue-700 { color: #17549a !important; }
        .cna-police-theme .border-blue-100 { border-color: #d5e6f8 !important; }
        .cna-police-theme .border-blue-200 { border-color: #c7dcf2 !important; }
        .cna-police-theme thead.bg-slate-50 { background: #edf4fb !important; }
        .cna-police-theme .divide-slate-100 > :not([hidden]) ~ :not([hidden]) { border-color: #e2ebf4 !important; }

        .cna-police-theme main {
          position: relative !important;
          top: 0 !important;
          margin-left: 263px !important;
          width: calc(100% - 263px) !important;
          min-height: 100vh !important;
          padding: 18px 20px 28px !important;
          box-sizing: border-box !important;
          align-self: flex-start !important;
        }
        .cna-police-theme main > .mb-6 {
          min-height: 62px;
          margin-bottom: 18px !important;
        }
        .cna-police-theme main::after {
          content: "";
          position: absolute;
          top: 78px;
          left: 7%;
          right: 4%;
          height: 76px;
          pointer-events: none;
          opacity: .42;
          background: url('/cna-police-banner.png') center/cover no-repeat;
          mix-blend-mode: multiply;
          z-index: 0;
        }
        .cna-police-theme main > * { position: relative; z-index: 1; }

        .cna-police-theme .reference-watermark { display: block; }

        .cna-police-theme main::before {
          content: "";
          position: fixed;
          top: 145px;
          right: 6%;
          pointer-events: none;
          font-size: clamp(34px,4vw,72px);
          font-weight: 800;
          letter-spacing: .13em;
          color: rgba(30,84,132,.035);
          white-space: nowrap;
          transform: rotate(-7deg);
          z-index: 0;
        }

        .cna-police-theme aside::after {
          content: "INDIAN POLICE  •  CYBER & CRIME INTELLIGENCE";
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 8px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid rgba(193,222,246,.12);
          color: rgba(211,231,249,.72);
          font-size: 9px;
          letter-spacing: .08em;
          white-space: nowrap;
          pointer-events: none;
        }
        .cna-police-theme aside { overflow: hidden; }
        .cna-police-theme .bg-white.rounded-xl,
        .cna-police-theme .bg-white.rounded-2xl { border-color: #d3e1ef !important; }
        @media (max-width: 1100px) {
          .cna-police-theme main {
          position: relative !important;
          top: 0 !important;
          margin-left: 263px !important;
          width: calc(100% - 263px) !important;
          min-height: 100vh !important;
          padding: 18px 20px 28px !important;
          box-sizing: border-box !important;
          align-self: flex-start !important;
        }
        .cna-police-theme main > .mb-6 {
          min-height: 62px;
          margin-bottom: 18px !important;
        }
        .cna-police-theme main::after {
          content: "";
          position: absolute;
          top: 78px;
          left: 7%;
          right: 4%;
          height: 76px;
          pointer-events: none;
          opacity: .42;
          background: url('/cna-police-banner.png') center/cover no-repeat;
          mix-blend-mode: multiply;
          z-index: 0;
        }
        .cna-police-theme main > * { position: relative; z-index: 1; }

        .cna-police-theme .reference-watermark { display: block; }

        .cna-police-theme main::before { display:none; }
        }
      `}</style>

      {/* ================= SIDEBAR ================= */}
<aside
  className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/15 bg-[#0b2a4a] transition-all duration-300 ${
    sidebarOpen ? "w-[263px]" : "w-0"
  } overflow-hidden`}
>
  {/* ================= BRAND ================= */}
<div className="border-b border-white/15 px-4 py-3">
  <img
    src="/cna-sidebar-brand.png"
    alt="Criminal Network Analysis System"
    className="block h-auto w-full max-w-[250px] object-contain"
  />
</div>

  {/* ================= NAVIGATION ================= */}

  <nav
    className="flex-1 overflow-y-auto px-4 py-6"
    aria-label="Main navigation"
  >

    {/* MAIN */}
    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
      Main
    </p>


    {/* Dashboard */}
    <button
      onClick={() => setActivePage('Dashboard')}
      className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${
        activePage === 'Dashboard'
          ? 'bg-blue-500 text-white'
          : 'text-blue-50 hover:bg-white/10 hover:text-white'
      }`}
    >

      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          activePage === 'Dashboard'
            ? 'bg-blue-500/20 text-blue-100'
            : 'bg-white/10 text-blue-100 group-hover:text-slate-200'
        }`}
      >

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>

      </span>

      <span className="text-sm font-medium">
        Dashboard
      </span>

    </button>


    {/* ================= RECORDS ================= */}
    <div className="mt-5">
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
        Records
      </p>

      {[
        ['cdr', 'Call Records', '📞'],
        ['fir', 'FIR Records', '▤'],
        ['transactions', 'Transaction Records', '₹'],
      ].map(([recordType, label, icon]) => {
        const isVisible = visibleRecords[recordType as keyof typeof visibleRecords]
        return (
          <button
            key={recordType}
            onClick={() => {
              setActivePage('Dashboard')
              setProfileOpen(false)
              setVisibleRecords((current) => ({ ...current, [recordType]: !current[recordType as keyof typeof current] }))
              if (!isVisible) void loadRecordType(recordType as 'cdr' | 'fir' | 'transactions')
            }}
            className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${isVisible ? 'bg-blue-500 text-white' : 'text-blue-50 hover:bg-white/10 hover:text-white'}`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${isVisible ? 'bg-blue-500/20 text-blue-100' : 'bg-white/10 text-blue-100 group-hover:text-slate-200'}`}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
          </button>
        )
      })}
    </div>

    {/* ================= OSINT ================= */}
    <button
      onClick={() => {
        setActivePage('OSINT')
        setProfileOpen(false)
        setVisibleRecords({
          cdr: false,
          fir: false,
          transactions: false,
        })
      }}
      className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${
        activePage === 'OSINT'
          ? 'bg-blue-500 text-white'
          : 'text-blue-50 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          activePage === 'OSINT'
            ? 'bg-blue-500/20 text-blue-100'
            : 'bg-white/10 text-blue-100 group-hover:text-slate-200'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6" />
          <path
            strokeLinecap="round"
            d="m16 16 4 4"
          />
        </svg>
      </span>

      <span className="text-sm font-medium">
        OSINT
      </span>
    </button>

    {/* Cases */}
    <button
      onClick={() => setActivePage('Cases')}
      className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${
        activePage === 'Cases'
          ? 'bg-blue-500 text-white'
          : 'text-blue-50 hover:bg-white/10 hover:text-white'
      }`}
    >

      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          activePage === 'Cases'
            ? 'bg-blue-500/20 text-blue-100'
            : 'bg-white/10 text-blue-100 group-hover:text-slate-200'
        }`}
      >

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 8.5A2.5 2.5 0 016.5 6H10l2 2h5.5A2.5 2.5 0 0120 10.5v7A2.5 2.5 0 0117.5 20h-11A2.5 2.5 0 014 17.5v-9Z"
          />
        </svg>

      </span>

      <span className="text-sm font-medium">
        Cases
      </span>

    </button>


    {/* Network */}
    <button
      onClick={() => setActivePage('Network')}
      className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${
        activePage === 'Network'
          ? 'bg-blue-500 text-white'
          : 'text-blue-50 hover:bg-white/10 hover:text-white'
      }`}
    >

      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          activePage === 'Network'
            ? 'bg-blue-500/20 text-blue-100'
            : 'bg-white/10 text-blue-100 group-hover:text-slate-200'
        }`}
      >

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="12" cy="18" r="2" />

          <path
            strokeLinecap="round"
            d="M7.8 7L16.2 8M7.2 7.7L10.8 16.3M16.8 8.7L13.2 16.3"
          />
        </svg>

      </span>

      <span className="text-sm font-medium">
        Network Explorer
      </span>

    </button>


    {/* Network Disruption Simulator */}
    <button onClick={() => setActivePage('Disruption')} className={`group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${activePage === 'Disruption' ? 'bg-blue-500 text-white' : 'text-blue-50 hover:bg-white/10 hover:text-white'}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activePage === 'Disruption' ? 'bg-blue-500/20 text-blue-100' : 'bg-white/10 text-blue-100 group-hover:text-slate-200'}`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="8" /><path strokeLinecap="round" d="M8 12h8M12 8v8M5.5 5.5l13 13" />
        </svg>
      </span>
      <span className="text-sm font-medium">Disruption Simulator</span>
    </button>

    {/* ================= INTELLIGENCE ================= */}

    <div className="mt-7">

      <button
        onClick={() => setIntelligenceOpen(!intelligenceOpen)}
        aria-expanded={intelligenceOpen}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 transition-all duration-200 ${
          intelligenceOpen
            ? 'border-white/20 bg-white/10'
            : 'border-white/15 bg-white/10 hover:bg-white/10'
        }`}
      >

        <div className="flex items-center gap-3">

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="3" />

              <path
                strokeLinecap="round"
                d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
              />

            </svg>

          </span>

          <span className="text-sm font-semibold text-slate-200">
            Intelligence
          </span>

        </div>


        <span
          className={`text-base text-blue-100 transition-transform duration-200 ${
            intelligenceOpen ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>

      </button>


      {intelligenceOpen && (

        <div className="mt-2 ml-5 space-y-1 border-l border-white/20 pl-3">

          <button
            onClick={() => setActivePage('Patterns')}
            className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-all ${
              activePage === 'Patterns'
                ? 'bg-blue-500 text-white'
                : 'text-blue-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Patterns
          </button>


          <button
            onClick={() => setActivePage('Investigation')}
            className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-all ${
              activePage === 'Investigation'
                ? 'bg-blue-500 text-white'
                : 'text-blue-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Investigation Path
          </button>


          <button
            onClick={() => setActivePage('Analytics')}
            className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-all ${
              activePage === 'Analytics'
                ? 'bg-blue-500 text-white'
                : 'text-blue-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
  onClick={() => setActivePage('Similarity')}
  className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-all ${
    activePage === 'Similarity'
      ? 'bg-blue-500 text-white'
      : 'text-blue-50 hover:bg-white/10 hover:text-white'
  }`}
>
  Similarity Analysis
</button>

        </div>

      )}

    </div>


    {/* ================= EVIDENCE ================= */}

    <div className="mt-3">

      <button
        onClick={() => setEvidenceOpen(!evidenceOpen)}
        aria-expanded={evidenceOpen}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 transition-all duration-200 ${
          evidenceOpen
            ? 'border-white/20 bg-white/10'
            : 'border-white/15 bg-white/10 hover:bg-white/10'
        }`}
      >

        <div className="flex items-center gap-3">

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 4h9l3 3v13H6V4Z"
              />

              <path
                strokeLinecap="round"
                d="M15 4v4h4M9 12h6M9 15h6"
              />

            </svg>

          </span>

          <span className="text-sm font-semibold text-slate-200">
            Evidence
          </span>

        </div>


        <span
          className={`text-base text-blue-100 transition-transform duration-200 ${
            evidenceOpen ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>

      </button>


      {evidenceOpen && (

        <div className="mt-2 ml-5 border-l border-white/20 pl-3">

          <button
            onClick={() => setActivePage('Evidence')}
            className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-all ${
              activePage === 'Evidence'
                ? 'bg-blue-500 text-white'
                : 'text-blue-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Evidence Records
          </button>

        </div>

      )}

    </div>


    {/* ================= SAFETY ================= */}

    <div className="mt-3">

      <button
        onClick={() => setSafetyOpen(!safetyOpen)}
        aria-expanded={safetyOpen}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 transition-all duration-200 ${
          safetyOpen
            ? 'border-white/20 bg-white/10'
            : 'border-white/15 bg-white/10 hover:bg-white/10'
        }`}
      >

        <div className="flex items-center gap-3">

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3L20 6V11C20 16.2 16.7 20.1 12 21C7.3 20.1 4 16.2 4 11V6L12 3Z"
              />

              <path
                strokeLinecap="round"
                d="M9 12h6M12 9v6"
              />

            </svg>

          </span>

          <span className="text-sm font-semibold text-slate-200">
            Safety
          </span>

        </div>


        <span
          className={`text-base text-blue-100 transition-transform duration-200 ${
            safetyOpen ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>

      </button>


      {safetyOpen && (

        <div className="mt-2 ml-5 space-y-1 border-l border-white/20 pl-3">

          <button
            onClick={() => setActivePage('Location')}
            className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-all ${
              activePage === 'Location'
                ? 'bg-blue-500 text-white'
                : 'text-blue-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Last Traced Location
          </button>


          <button
            onClick={() => setActivePage('WomenSafety')}
            className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-all ${
              activePage === 'WomenSafety'
                ? 'bg-blue-500 text-white'
                : 'text-blue-50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Women Safety
          </button>

        </div>

      )}

    </div>

  </nav>


  {/* ================= FOOTER ================= */}

  <div className="border-t border-white/15 p-4">

    <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-blue-50">
        IN
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-medium text-slate-200">
          {authUser?.name || authUser?.username || 'Investigator'}
        </p>

        <p className="mt-0.5 text-xs text-blue-200">
          Authorized User
        </p>

      </div>

      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.7)]" />

    </div>

  </div>

</aside>


      {/* ================= MAIN ================= */}

      <main className="ml-[263px] min-h-screen p-8">

        {/* ================= TOP BAR ================= */}

        <div className="mb-5 flex min-h-[62px] items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-2.5">

          <div className="flex min-w-0 flex-1 items-center gap-0">
            <div className="relative min-w-0 flex-1 max-w-[640px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setGlobalSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && globalSearchResults.length > 0) {
                  const firstResult = globalSearchResults[0]

                  if (firstResult.kind === 'entity') {
                    setSelectedEntityId(firstResult.id)
                    setVisibleRecords({ cdr: false, fir: false, transactions: false })
                    setActivePage('Dashboard')
                  } else {
                    setCaseSearchQuery(firstResult.id)
                    setActivePage('Cases')
                  }

                  setGlobalSearchOpen(false)
                }
              }}
              placeholder="Search criminal name or ID..."
              aria-label="Global search"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />

            {globalSearchOpen && searchQuery.trim() !== '' && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {globalSearchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto py-2">
                    {globalSearchResults.map((result) => (
                      <button
                        key={`${result.kind}-${result.id}`}
                        type="button"
                        onClick={() => {
                          if (result.kind === 'entity') {
                            setSelectedEntityId(result.id)
                            setVisibleRecords({ cdr: false, fir: false, transactions: false })
                            setActivePage('Dashboard')
                          } else {
                            setCaseSearchQuery(result.id)
                            setActivePage('Cases')
                          }

                          setGlobalSearchOpen(false)
                        }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-blue-50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {result.label}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {result.type}
                          </p>
                        </div>

                        <span className="ml-4 shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase text-blue-700">
                          {result.kind}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      No results found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try a case ID, person, phone, vehicle or account name.
                    </p>
                  </div>
                )}
              </div>
            )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (globalSearchResults.length > 0) {
                  const firstResult = globalSearchResults[0]
                  if (firstResult.kind === 'entity') {
                    setSelectedEntityId(firstResult.id)
                    setVisibleRecords({ cdr: false, fir: false, transactions: false })
                    setActivePage('Dashboard')
                  } else {
                    setCaseSearchQuery(firstResult.id)
                    setActivePage('Cases')
                  }
                  setGlobalSearchOpen(false)
                }
              }}
              className="h-12 w-[145px] shrink-0 rounded-lg bg-[#0b3f73] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0a3561]"
            >
              Search
            </button>
          </div>

          <div className="relative flex items-center gap-4">

            <button
              aria-label="Notifications"
              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-blue-50"
            >
              🔔
            </button>

            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-label="Open administrator profile"
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l7 3v5c0 4.7-2.9 8.3-7 10-4.1-1.7-7-5.3-7-10V6l7-3Z"
                  />
                  <circle cx="12" cy="10" r="2.2" />
                  <path
                    strokeLinecap="round"
                    d="M8.5 17c.8-1.8 2-2.7 3.5-2.7s2.7.9 3.5 2.7"
                  />
                </svg>
              </span>

              <span>
                <p className="text-sm font-medium">
                  {authUser?.name || authUser?.username || 'Investigator'}
                </p>
                <p className="text-xs text-slate-500">
                  {authUser?.role || 'Authorized User'}
                </p>
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-6 w-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3l7 3v5c0 4.7-2.9 8.3-7 10-4.1-1.7-7-5.3-7-10V6l7-3Z"
                        />
                        <circle cx="12" cy="10" r="2.2" />
                        <path strokeLinecap="round" d="M8.5 17c.8-1.8 2-2.7 3.5-2.7s2.7.9 3.5 2.7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {authUser?.name || authUser?.username || 'Investigator'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {authUser?.role || 'Authorized User'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Username</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {authUser?.username || '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {authUser?.id || '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Access Role</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {authUser?.role || 'Authorized User'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      handleLogout()
                    }}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

          </div>

          <img
            src="/cna-top-right.png"
            alt="Law Enforcement for a Safer India"
            className="hidden h-14 w-[132px] object-contain xl:block"
          />
        </div>


        {/* ================= DASHBOARD ================= */}
        {activePage === 'Dashboard' && (
          <section className="space-y-8">
            <header>
              <h2 className="text-3xl font-bold text-slate-900">Criminal Investigation Dashboard</h2>
              <p className="mt-1 text-slate-600">Search a criminal by name or ID and view the selected records below.</p>
            </header>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900">Criminal Information</h3>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Name</p><p className="mt-2 font-semibold text-slate-900">{selectedEntity.label}</p></div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Criminal ID</p><p className="mt-2 font-semibold text-slate-900">{selectedEntity.id}</p></div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Location</p><p className="mt-2 font-semibold text-slate-900">{cdrRecords.find((r) => r.linkedPerson === selectedEntity.label)?.location || '—'}</p></div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Vehicle</p><p className="mt-2 font-semibold text-slate-900">{entities.find((e) => e.id === relationships.find((r) => r.source === selectedEntity.id && r.target.startsWith('vehicle'))?.target)?.label || '—'}</p></div>
              </div>
            </section>

            {recordLoading && <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">Extracting selected record data...</div>}
            {recordError && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{recordError}</div>}

            {visibleRecords.cdr && (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-5"><h3 className="text-xl font-semibold text-slate-900">Call Detail Records (CDR)</h3></div>
                <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Record ID</th><th className="px-5 py-4">Caller</th><th className="px-5 py-4">Receiver</th><th className="px-5 py-4">Date / Time</th><th className="px-5 py-4">Duration</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Linked Person</th></tr></thead><tbody className="divide-y divide-slate-100">{cdrRecords.filter((r) => r.linkedPerson === selectedEntity.label).map((r) => <tr key={r.id}><td className="px-5 py-4 font-medium">{r.id}</td><td className="px-5 py-4">{r.caller}</td><td className="px-5 py-4">{r.receiver}</td><td className="px-5 py-4">{r.date} · {r.time}</td><td className="px-5 py-4">{r.duration}</td><td className="px-5 py-4">{r.callType}</td><td className="px-5 py-4">{r.location}</td><td className="px-5 py-4">{r.linkedPerson}</td></tr>)}</tbody></table></div>
              </section>
            )}

            {visibleRecords.fir && (
              <section className="space-y-4"><h3 className="text-xl font-semibold text-slate-900">FIR Records</h3>{firRecords.filter((r) => r.person === selectedEntity.label).map((r) => <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-wide text-slate-500">FIR Record</p><h4 className="mt-1 text-lg font-semibold">{r.id}</h4><p className="mt-1 text-sm text-slate-500">Case: {r.caseNumber}</p></div><span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">{r.status}</span></div><div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Person',r.person],['Date',r.date],['Police Station',r.policeStation],['Sections',r.sections]].map(([label,value]) => <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>)}</div><div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Incident</p><p className="mt-2 text-sm leading-6 text-slate-700">{r.incident}</p></div></div>)}</section>
            )}

            {visibleRecords.transactions && (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-200 px-6 py-5"><h3 className="text-xl font-semibold text-slate-900">Transaction Records</h3></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Transaction ID</th><th className="px-5 py-4">Date / Time</th><th className="px-5 py-4">Sender</th><th className="px-5 py-4">Receiver</th><th className="px-5 py-4">Account</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{transactionRecords.map((r) => <tr key={r.id}><td className="px-5 py-4 font-medium">{r.id}</td><td className="px-5 py-4">{r.date} · {r.time}</td><td className="px-5 py-4">{r.sender}</td><td className="px-5 py-4">{r.receiver}</td><td className="px-5 py-4">{r.account}</td><td className="px-5 py-4 font-semibold">{r.amount}</td><td className="px-5 py-4">{r.type}</td><td className="px-5 py-4">{r.status}</td></tr>)}</tbody></table></div></section>
            )}
          </section>
        )}

        {/* ================= CASES ================= */}

{activePage === 'Cases' && (
  <section className="space-y-6">
    {/* Page Header */}
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Cases
      </h1>

      <p className="mt-1 text-sm text-slate-600">
        Review and investigate active criminal intelligence cases.
      </p>
    </div>

    {/* Search and Filters */}
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row">
      
      {/* Search */}
      <input
        type="text"
        value={caseSearchQuery}
        onChange={(e) => setCaseSearchQuery(e.target.value)}
        placeholder="Search cases, entities, locations..."
        aria-label="Search cases"
        className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500"
      />

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        aria-label="Filter cases by status"
        className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Under Review">Under Review</option>
        <option value="Closed">Closed</option>
      </select>

      {/* Case Type Filter */}
      <select
        value={caseTypeFilter}
        onChange={(e) => setCaseTypeFilter(e.target.value)}
        aria-label="Filter cases by type"
        className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
      >
        <option value="All">All Types</option>
        <option value="Network Investigation">
          Network Investigation
        </option>
        <option value="Communication Pattern">
          Communication Pattern
        </option>
        <option value="Women Safety">
          Women Safety
        </option>
      </select>

      {/* Clear Filters */}
      {(caseSearchQuery ||
        statusFilter !== 'All' ||
        caseTypeFilter !== 'All') && (
        <button
          type="button"
          onClick={() => {
            setCaseSearchQuery('')
            setStatusFilter('All')
            setCaseTypeFilter('All')
          }}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear
        </button>
      )}
    </div>


    {/* Cases */}
    <div className="space-y-3">
      
      {/* Cases Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
          Investigation Cases
        </h2>

        <span className="text-xs text-slate-500">
          {filteredCases.length}{' '}
          {filteredCases.length === 1 ? 'case' : 'cases'}
        </span>
      </div>

      {/* No Cases Found */}
      {filteredCases.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No cases found
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Try changing the search or filters.
          </p>
        </div>
      ) : (
        filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              
              {/* Case Information */}
              <div>
                
                {/* Case ID + Status */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  <h3 className="text-base font-semibold text-slate-900">
                    {caseItem.id}
                  </h3>

                  {/* Active */}
                  {caseItem.status === 'Active' && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-600">
                      Active
                    </span>
                  )}

                  {/* Under Review */}
                  {caseItem.status === 'Under Review' && (
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-600">
                      Under Review
                    </span>
                  )}

                  {/* Closed */}
                  {caseItem.status === 'Closed' && (
                    <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      Closed
                    </span>
                  )}

                  {/* Case Type */}
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                    {caseItem.type}
                  </span>
                </div>

                {/* Case Title */}
                <p className="mt-2 text-sm text-slate-700">
                  {caseItem.title}
                </p>

                {/* Case Description */}
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {caseItem.description}
                </p>

                {/* Case Statistics */}
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  
                  {caseItem.id === 'CASE-2026-0142' && (
                    <>
                      <span>12 Entities</span>
                      <span>4 Connections</span>
                      <span>Updated: Today</span>
                    </>
                  )}

                  {caseItem.id === 'CASE-2026-0138' && (
                    <>
                      <span>8 Entities</span>
                      <span>3 Connections</span>
                      <span>Updated: Yesterday</span>
                    </>
                  )}

                  {caseItem.id === 'CASE-2026-0129' && (
                    <>
                      <span>6 Entities</span>
                      <span>2 Connections</span>
                      <span>Updated: 2 days ago</span>
                    </>
                  )}
                </div>
              </div>

              {/* View Case Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedEntityId('person1')
                  setActivePage('Network')
                }}
                className="shrink-0 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                View Case →
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </section>
)}

        {/* ================= NETWORK EXPLORER ================= */}

       {activePage === 'Network' && (
  <section>
    {/* HEADER */}
    <header className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Network Explorer
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Investigate relationships and connected entities.
          </p>
        </div>

        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <span className="mr-1.5">●</span>
          Live Network
        </div>
      </div>
    </header>

    {/* SEARCH + FILTER */}
    <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search entity..."
            aria-label="Search network entities"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(event) => setEntityFilter(event.target.value)}
          aria-label="Filter entities"
          className="w-48 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400"
        >
          <option value="All">All Entities</option>
          <option value="Person">Person</option>
          <option value="Phone">Phone</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Case">Case</option>
          <option value="Account">Account</option>
          <option value="Organization">Organization</option>
          <option value="Location">Location</option>
        </select>
      </div>
    </div>

    {/* MAIN NETWORK */}
    <div className="grid grid-cols-12 gap-5">

      {/* LEFT — ENTITIES */}
      <div className="col-span-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4">
          <h3 className="font-semibold text-slate-900">
            Entities
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {filteredEntities.length} entities found
          </p>
        </div>

        <div className="max-h-[620px] space-y-1 overflow-y-auto p-3">
          {filteredEntities.map((entity) => (
            <button
              key={entity.id}
              type="button"
              onClick={() => openEntity(entity.id)}
              className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                selectedEntityId === entity.id
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">

                {/* ENTITY TYPE SHAPE */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center ${
                    entity.type === 'Person'
                      ? 'rounded-full bg-blue-600'
                      : entity.type === 'Phone'
                        ? 'rounded-full bg-green-600'
                        : entity.type === 'Vehicle'
                          ? 'rounded-md bg-amber-500'
                          : entity.type === 'Account'
                            ? 'rounded-md bg-violet-600'
                            : entity.type === 'Case'
                              ? 'rotate-45 bg-red-600'
                              : entity.type === 'Organization'
                                ? 'rounded-md bg-cyan-600'
                                : 'rounded-full bg-slate-500'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold text-white ${
                      entity.type === 'Case'
                        ? '-rotate-45'
                        : ''
                    }`}
                  >
                    {entity.type === 'Person'
                      ? 'P'
                      : entity.type === 'Phone'
                        ? '☎'
                        : entity.type === 'Vehicle'
                          ? 'V'
                          : entity.type === 'Account'
                            ? 'A'
                            : entity.type === 'Case'
                              ? 'C'
                              : entity.type === 'Organization'
                                ? 'O'
                                : 'L'}
                  </span>
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {entity.label}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {entity.type}
                  </p>
                </div>

              </div>
            </button>
          ))}

          {filteredEntities.length === 0 && (
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              No entities found.
            </p>
          )}
        </div>
      </div>

      {/* CENTER — NETWORK GRAPH */}
      <div className="col-span-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* GRAPH HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Network Visualization
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Connected entities and relationship paths
            </p>
          </div>

          <div className="flex gap-2">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">
              Nodes: {filteredEntities.length}
            </span>

            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">
              Links: {relationships.length}
            </span>
          </div>
        </div>

        {/* GRAPH AREA */}
        <div className="relative h-[620px] bg-slate-50">

          <CytoscapeComponent
            elements={networkElements}
            style={{
              width: '100%',
              height: '100%',
            }}

            layout={{
              name: 'cose',
              animate: false,
              fit: true,
              padding: 65,

              // Makes the graph compact like an investigation network
              nodeRepulsion: 9000,
              idealEdgeLength: 105,
              edgeElasticity: 0.25,
              gravity: 0.8,
              numIter: 800,
              randomize: true,
            }}

            minZoom={0.5}
            maxZoom={2.5}

            stylesheet={[

              /* =========================
                 DEFAULT NODE
              ========================= */
              {
                selector: 'node',
                style: {
                  label: 'data(label)',

                  'background-color': '#64748b',

                  color: '#ffffff',

                  'font-size': '10px',

                  'font-weight': 'bold',

                  'text-valign': 'center',

                  'text-halign': 'center',

                  'text-wrap': 'wrap',

                  'text-max-width': '70px',

                  'border-width': 4,

                  'border-color': '#ffffff',

                  'overlay-opacity': 0,

                  'z-index': 10,
                },
              },

              /* =========================
                 PERSON
              ========================= */
              {
                selector: 'node[type="Person"]',
                style: {
                  shape: 'ellipse',

                  width: 74,
                  height: 74,

                  'background-color': '#2563eb',

                  'border-color': '#ffffff',

                  'font-size': '11px',

                  'text-max-width': '60px',
                },
              },

              /* =========================
                 PHONE
              ========================= */
              {
                selector: 'node[type="Phone"]',
                style: {
                  shape: 'ellipse',

                  width: 64,
                  height: 64,

                  'background-color': '#16a34a',

                  'border-color': '#ffffff',

                  'font-size': '10px',

                  'text-max-width': '55px',
                },
              },

              /* =========================
                 VEHICLE
              ========================= */
              {
                selector: 'node[type="Vehicle"]',
                style: {
                  shape: 'round-rectangle',

                  width: 86,
                  height: 58,

                  'background-color': '#f59e0b',

                  'border-color': '#ffffff',

                  'font-size': '10px',

                  'text-max-width': '72px',
                },
              },

              /* =========================
                 ACCOUNT
              ========================= */
              {
                selector: 'node[type="Account"]',
                style: {
                  shape: 'round-rectangle',

                  width: 88,
                  height: 58,

                  'background-color': '#7c3aed',

                  'border-color': '#ffffff',

                  'font-size': '10px',

                  'text-max-width': '74px',
                },
              },

              /* =========================
                 CASE
              ========================= */
              {
                selector: 'node[type="Case"]',
                style: {
                  shape: 'diamond',

                  width: 78,
                  height: 78,

                  'background-color': '#dc2626',

                  'border-color': '#ffffff',

                  'font-size': '10px',

                  'text-max-width': '55px',
                },
              },

              /* =========================
                 ORGANIZATION
              ========================= */
              {
                selector: 'node[type="Organization"]',
                style: {
                  shape: 'round-rectangle',

                  width: 100,
                  height: 58,

                  'background-color': '#0891b2',

                  'border-color': '#ffffff',

                  'font-size': '10px',

                  'text-max-width': '82px',
                },
              },

              /* =========================
                 LOCATION
              ========================= */
              {
                selector: 'node[type="Location"]',
                style: {
                  shape: 'ellipse',

                  width: 64,
                  height: 64,

                  'background-color': '#64748b',

                  'border-color': '#ffffff',

                  'font-size': '10px',

                  'text-max-width': '50px',
                },
              },

              /* =========================
                 EDGES
              ========================= */
              {
                selector: 'edge',
                style: {
                  width: 1.8,

                  'line-color': '#94a3b8',

                  'target-arrow-color': '#64748b',

                  'target-arrow-shape': 'triangle',

                  'arrow-scale': 0.75,

                  'curve-style': 'bezier',

                  opacity: 0.9,

                  label: 'data(label)',

                  color: '#64748b',

                  'font-size': '8px',

                  'font-weight': '500',

                  'text-background-color': '#f8fafc',

                  'text-background-opacity': 1,

                  'text-background-padding': '3px',

                  'text-rotation': 'autorotate',

                  'text-margin-y': -4,
                },
              },

              /* =========================
                 SELECTED NODE
              ========================= */
              {
                selector: `node[id="${selectedEntityId}"]`,
                style: {
                  'border-width': 5,

                  'border-color': '#1d4ed8',

                  'shadow-blur': 18,

                  'shadow-color': '#2563eb',

                  'shadow-opacity': 0.35,

                  'shadow-offset-x': 0,

                  'shadow-offset-y': 0,
                },
              },

              /* =========================
                 SELECTED NODE EDGES
              ========================= */
              {
                selector: `node[id="${selectedEntityId}"] ~ edge`,
                style: {
                  width: 2.5,

                  'line-color': '#64748b',

                  'target-arrow-color': '#475569',
                },
              },
            ]}

            /* =========================
               NODE CLICK
            ========================= */
            cy={(cy: Core) => {

              cy.on('tap', 'node', (event: any) => {

                const nodeId = event.target.id()

                openEntity(nodeId)
              })
            }}
          />

          {/* =========================
              ZOOM CONTROLS
          ========================= */}
          <div className="absolute left-4 top-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

            <button
              type="button"
              className="block h-9 w-9 border-b border-slate-200 text-lg text-slate-600 hover:bg-slate-50"
              onClick={() => {
                // Cytoscape native zoom is handled through graph controls
              }}
            >
              +
            </button>

            <button
              type="button"
              className="block h-9 w-9 text-lg text-slate-600 hover:bg-slate-50"
            >
              −
            </button>

          </div>

          {/* =========================
              LEGEND
          ========================= */}
          <div className="absolute bottom-4 left-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Entity Types
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">

              {/* Person */}
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full bg-blue-600" />
                <span className="text-[10px] text-slate-600">
                  Person
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full bg-green-600" />
                <span className="text-[10px] text-slate-600">
                  Phone
                </span>
              </div>

              {/* Vehicle */}
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-sm bg-amber-500" />
                <span className="text-[10px] text-slate-600">
                  Vehicle
                </span>
              </div>

              {/* Account */}
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-sm bg-violet-600" />
                <span className="text-[10px] text-slate-600">
                  Account
                </span>
              </div>

              {/* Case */}
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rotate-45 bg-red-600" />
                <span className="text-[10px] text-slate-600">
                  Case
                </span>
              </div>

              {/* Organization */}
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-sm bg-cyan-600" />
                <span className="text-[10px] text-slate-600">
                  Organization
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full bg-slate-500" />
                <span className="text-[10px] text-slate-600">
                  Location
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* RIGHT — ENTITY DETAILS */}
      <div className="col-span-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">
            Entity Details
          </h3>
        </div>

        <div className="max-h-[620px] overflow-y-auto p-5">

          {/* SELECTED ENTITY */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
              Selected Entity
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {selectedEntity.label}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {selectedEntity.type}
            </p>

          </div>

          {/* STATUS */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Status
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {selectedEntity.status}
            </p>

          </div>

          {/* DESCRIPTION */}
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {selectedEntity.description}
            </p>

          </div>

          {/* NETWORK IDENTITY */}
          <div className="mt-5">

            <h4 className="text-sm font-semibold text-slate-900">
              Network Identity
            </h4>

            <div className="mt-3 grid grid-cols-2 gap-2">

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] text-slate-500">
                  Connected
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {selectedRelationships.length}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] text-slate-500">
                  Resolution
                </p>

                <p className="mt-1 text-sm font-semibold text-emerald-600">
                  High
                </p>
              </div>

            </div>
          </div>

          {/* LOCATION */}
          <button
            type="button"
            onClick={() => {
              setLocationEntityId(selectedEntity.id)
              setActivePage('Location')
            }}
            className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            View Last Traced Location
          </button>

          {/* RELATIONSHIPS */}
          <div className="mt-5">

            <h4 className="text-sm font-semibold text-slate-900">
              Relationships
            </h4>

            <div className="mt-3 space-y-2">

              {selectedRelationships.map((relationship) => {

                const otherEntityId =
                  relationship.source === selectedEntity.id
                    ? relationship.target
                    : relationship.source

                const otherEntity = entities.find(
                  (entity) => entity.id === otherEntityId,
                )

                return (
                  <button
                    key={relationship.id}
                    type="button"
                    onClick={() => openEntity(otherEntityId)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >

                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      {relationship.label}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {otherEntity?.label || 'Unknown Entity'}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {otherEntity?.type || 'Unknown'}
                    </p>

                  </button>
                )
              })}

              {selectedRelationships.length === 0 && (
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                  No relationships found.
                </p>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>

    {/* NOTICE */}
    <div className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Investigation Notice
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-600">
        Relationships and patterns shown here are analytical
        indicators based on available authorized data. They do not
        establish guilt or criminal responsibility.
      </p>

    </div>
  </section>
)}
        {/* ================= NETWORK DISRUPTION SIMULATOR ================= */}
        {activePage === 'Disruption' && (
          <section>
            <header className="mb-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">What-if analysis</span>
                    <span className="text-xs text-slate-500">Read-only simulation</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Network Disruption Simulator</h2>
                  <p className="mt-1 max-w-3xl text-slate-600">Hypothetically remove an entity or relationship and evaluate how the investigation network could change.</p>
                </div>
                {disruptionSimulated && <button type="button" onClick={() => setDisruptionSimulated(false)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Reset Simulation</button>}
              </div>
            </header>

            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 rounded-xl border border-slate-200 bg-white p-6 xl:col-span-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path strokeLinecap="round" d="M8 12h8" /></svg>
                  </div>
                  <div><h3 className="font-semibold text-slate-900">Simulation target</h3><p className="mt-1 text-xs leading-5 text-slate-500">Select what-if target from the current investigation dataset.</p></div>
                </div>
                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="disruption-type" className="mb-2 block text-sm font-medium text-slate-700">Target type</label>
                    <select id="disruption-type" value={disruptionType} onChange={(event) => { setDisruptionType(event.target.value); setDisruptionSimulated(false) }} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <option value="Entity">Entity</option><option value="Relationship">Relationship</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="disruption-target" className="mb-2 block text-sm font-medium text-slate-700">{disruptionType === 'Entity' ? 'Entity to remove' : 'Relationship to remove'}</label>
                    <select id="disruption-target" value={disruptionEntityId} onChange={(event) => { setDisruptionEntityId(event.target.value); setDisruptionSimulated(false) }} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      {disruptionType === 'Entity' ? entities.map((entity) => <option key={entity.id} value={entity.id}>{entity.label} — {entity.type}</option>) : relationships.map((relationship) => { const source=entities.find(e=>e.id===relationship.source); const target=entities.find(e=>e.id===relationship.target); return <option key={relationship.id} value={relationship.id}>{source?.label} → {target?.label} · {relationship.label}</option> })}
                    </select>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Simulation only</p><p className="mt-1 text-xs leading-5 text-amber-800">No real records are deleted or modified. This analysis models a hypothetical network change.</p></div>
                  <button type="button" onClick={() => setDisruptionSimulated(true)} className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100">Run Disruption Simulation</button>
                </div>
              </div>

              <div className="col-span-12 xl:col-span-8">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    ['Network Components', String(disruptionSimulated ? disruptedMetrics.components : baselineMetrics.components), disruptionSimulated ? `${componentDelta >= 0 ? '+' : ''}${componentDelta}` : 'Baseline'],
                    ['Network Density', formatMetric(disruptionSimulated ? disruptedMetrics.density : baselineMetrics.density), disruptionSimulated ? `${(disruptedMetrics.density - baselineMetrics.density).toFixed(2)}` : 'Baseline'],
                    ['Average Path', `${formatMetric(disruptionSimulated ? disruptedMetrics.averagePath : baselineMetrics.averagePath)} hops`, disruptionSimulated ? `${pathDelta >= 0 ? '+' : ''}${pathDelta.toFixed(2)} hops` : 'Baseline'],
                    ['Remaining Links', String(disruptionSimulated ? disruptedMetrics.links : baselineMetrics.links), disruptionSimulated ? `${linkDelta >= 0 ? '+' : ''}${linkDelta}` : 'Baseline'],
                  ].map(([label,value,change]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p><p className={`mt-1 text-xs font-medium ${disruptionSimulated ? 'text-amber-700' : 'text-slate-500'}`}>{change}</p></div>)}
                </div>

                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between"><div><h3 className="text-lg font-semibold text-slate-900">Network impact assessment</h3><p className="mt-1 text-sm text-slate-500">Structural comparison between the current network and the hypothetical scenario.</p></div><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${disruptionSimulated ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>{disruptionSimulated ? 'SIMULATION COMPLETE' : 'AWAITING SIMULATION'}</span></div>
                  <div className="mt-6 space-y-4">
                    {[
                      ['Connected components', String(baselineMetrics.components), String(disruptedMetrics.components), disruptionSimulated ? 'Network connectivity is recalculated after the hypothetical change.' : 'Baseline network connectivity.'],
                      ['Network density', formatMetric(baselineMetrics.density), formatMetric(disruptedMetrics.density), disruptionSimulated ? 'Relationship density changes in the simulated network.' : 'Baseline network density.'],
                      ['Average path length', `${formatMetric(baselineMetrics.averagePath)} hops`, `${formatMetric(disruptedMetrics.averagePath)} hops`, disruptionSimulated ? 'Average reachable path length is recalculated.' : 'Baseline average path length.'],
                      ['Remaining relationships', String(baselineMetrics.links), String(disruptedMetrics.links), disruptionSimulated ? 'Relationships incident to the simulated target are excluded.' : 'Baseline relationship count.'],
                    ].map(([metric,before,after,note]) => <div key={metric} className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-12 md:items-center"><div className="md:col-span-4"><p className="text-sm font-semibold text-slate-900">{metric}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div><div className="md:col-span-3"><p className="text-[11px] uppercase tracking-wide text-slate-500">Before</p><p className="mt-1 text-sm font-semibold text-slate-800">{before}</p></div><div className="md:col-span-3"><p className="text-[11px] uppercase tracking-wide text-slate-500">After</p><p className={`mt-1 text-sm font-semibold ${disruptionSimulated?'text-blue-700':'text-slate-800'}`}>{after}</p></div><div className="md:col-span-2"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${disruptionSimulated?'bg-blue-50 text-blue-700':'bg-slate-100 text-slate-500'}`}>{disruptionSimulated?'Changed':'Baseline'}</span></div></div>)}
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-semibold text-slate-900">Interpretation</h3><div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4"><p className="text-sm leading-6 text-blue-900">{disruptionSimulated ? (disruptedMetrics.components > baselineMetrics.components ? 'The hypothetical change increases network fragmentation and reduces connectivity in the current model. Review the affected relationships and underlying evidence before drawing conclusions.' : 'The hypothetical change alters the network structure without increasing the number of disconnected components in the current model. Review the affected relationships and underlying evidence before drawing conclusions.') : 'Run a simulation to compare network structure before and after a hypothetical removal.'}</p></div></div>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-5"><p className="text-sm font-semibold text-slate-700">Investigation notice</p><p className="mt-1 text-sm leading-6 text-slate-500">Disruption analysis is hypothetical and intended to support investigative decision-making. It does not establish guilt, criminal responsibility, or the real-world effect of removing an entity or relationship.</p></div>
          </section>
        )}

        {/* ================= INVESTIGATION PATH ================= */}

        {activePage === 'Investigation' && (
          <section>

            <header className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Investigation Path
              </h2>

              <p className="mt-1 text-slate-600">
                Explore possible paths between two entities.
              </p>

            </header>


            <div className="grid grid-cols-3 gap-5">

              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Start Entity
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  Person A
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  PERSON · person1
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Target Entity
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  Organization X
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  ORGANIZATION · org1
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Path Summary
                </p>

                <p className="mt-2 text-3xl font-bold">
                  3 Hops
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Potential relationship path
                </p>

              </div>

            </div>


            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold">
                    Potential Investigation Path
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Relationship chain identified from available records.
                  </p>

                </div>

                <span className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700">
                  REVIEW REQUIRED
                </span>

              </div>


              <div className="mt-6 flex items-center gap-3 overflow-x-auto">

                <div className="min-w-[180px] rounded-lg border border-slate-300 bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    PERSON
                  </p>

                  <p className="mt-1 font-semibold">
                    Person A
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Start Entity
                  </p>

                </div>


                <div className="text-slate-500">
                  →
                </div>


                <div className="min-w-[180px] rounded-lg border border-slate-300 bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    PHONE
                  </p>

                  <p className="mt-1 font-semibold">
                    +91 XXXXXXX123
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    USES
                  </p>

                </div>


                <div className="text-slate-500">
                  →
                </div>


                <div className="min-w-[180px] rounded-lg border border-slate-300 bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    CASE
                  </p>

                  <p className="mt-1 font-semibold">
                    CASE-2026-0142
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    MENTIONED IN
                  </p>

                </div>


                <div className="text-slate-500">
                  →
                </div>


                <div className="min-w-[180px] rounded-lg border border-slate-300 bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    ORGANIZATION
                  </p>

                  <p className="mt-1 font-semibold">
                    Organization X
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Target Entity
                  </p>

                </div>

              </div>
            </div>


            <div className="mt-5 grid grid-cols-3 gap-5">

              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Relationship Types
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  USES · MENTIONED IN · CONNECTED TO
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Evidence Records
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  4
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Confidence
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  82%
                </p>

              </div>

            </div>


            <div className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-5">

              <p className="text-sm font-medium text-slate-700">
                Investigation Notice
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This path represents a potential relationship chain based on
                available records. It does not establish guilt, criminality, or
                direct involvement. Investigators should review the underlying
                evidence and relationship sources.
              </p>

            </div>

          </section>
        )}


        {/* ================= PATTERNS ================= */}

        {activePage === 'Patterns' && (
          <section>

            <header className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Pattern Detection
              </h2>

              <p className="mt-1 text-slate-600">
                Potential patterns and intelligence indicators.
              </p>

            </header>


            <div className="grid grid-cols-2 gap-5">

              {[
                [
                  'Potential Network Bridge',
                  'An entity appears to connect multiple investigation clusters.',
                ],
                [
                  'Repeated Location Pattern',
                  'Similar activity appears across multiple cases.',
                ],
                [
                  'Cross-Case Connection',
                  'Shared entities appear across investigations.',
                ],
                [
                  'Communication Activity Change',
                  'A change in communication behavior requires investigator review.',
                ],
              ].map(([title, description]) => (

                <div
                  key={title}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >

                  <p className="text-sm text-slate-500">
                    Potential Pattern
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {description}
                  </p>

                </div>

              ))}

            </div>

          </section>
        )}


        {/* ================= EVIDENCE ================= */}

        {activePage === 'Evidence' && (
  <section>
    <header className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900">
        Evidence Analysis
      </h2>

      <p className="mt-1 text-slate-600">
        Search evidence records and identify potentially similar
        investigative information.
      </p>
    </header>

    {/* SEARCH PANEL */}
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={evidenceQuery}
          onChange={(event) => {
            setEvidenceQuery(event.target.value)
            setEvidenceError('')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              searchEvidence()
            }
          }}
          placeholder="Enter evidence description..."
          aria-label="Search evidence"
          className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={searchEvidence}
          disabled={evidenceLoading}
          className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {evidenceLoading ? 'Searching...' : 'Search Evidence'}
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Search is performed against authorized evidence records available
        to the backend.
      </p>
    </div>

    {/* ERROR / STATUS */}
    {evidenceError && (
      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          {evidenceError}
        </p>
      </div>
    )}

    {/* RESULTS */}
    {evidenceResults.length > 0 && (
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Potentially Similar Evidence
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {evidenceResults.length} matching record
              {evidenceResults.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            REVIEW REQUIRED
          </span>
        </div>

        {evidenceResults.map((result) => (
          <div
            key={result.evidence_id}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Evidence ID
                </p>

                <h4 className="mt-1 text-lg font-semibold text-slate-900">
                  {result.evidence_id}
                </h4>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-center">
                <p className="text-xs text-blue-700">
                  Similarity
                </p>

                <p className="text-xl font-bold text-blue-800">
                  {result.similarity}%
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {result.description}
              </p>
            </div>

            {/* RECORD DETAILS */}
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Actor
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {result.actor_id}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Case
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {result.case_id}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Vehicle
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {result.vehicle_id}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Location
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {result.location}
                </p>
              </div>
            </div>

            {/* NOTICE */}
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Investigation Notice
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                Similarity is an analytical indicator only. It does not
                establish that evidence belongs to the same incident or
                that any person is responsible. Investigators must review
                the underlying records.
              </p>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* INITIAL STATE */}
    {evidenceResults.length === 0 &&
      !evidenceError &&
      !evidenceLoading && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Evidence Search
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Enter an evidence description above to search the backend
            evidence records.
          </p>
        </div>
      )}
  </section>
)}


        {/* ================= LAST TRACED LOCATION ================= */}

        {activePage === 'Location' && (
          <section>

            <header className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Last Traced Location
              </h2>

              <p className="mt-1 text-slate-600">
                View the latest authorized location available for an
                investigation.
              </p>

            </header>


            <div className="grid grid-cols-3 gap-5">

              <div className="col-span-2 h-[550px] overflow-hidden rounded-xl border border-slate-200 bg-white">

                <LocationMap
                  latitude={23.0225}
                  longitude={72.5714}
                  locationName="Ahmedabad"
                  timestamp="08 Sep 2026, 18:42"
                  source="CDR / Authorized Location Record"
                  confidence="High"
                />

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Latest Known Location
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  Ahmedabad
                </h3>


                <div className="mt-6 space-y-5">

                  <div>

                    <p className="text-xs text-slate-500">
                      Timestamp
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      08 Sep 2026, 18:42
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-500">
                      Source
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      CDR / Authorized Location Record
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-500">
                      Confidence
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      High
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-slate-500">
                      Coordinates
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      23.0225, 72.5714
                    </p>

                  </div>

                </div>


                <div className="mt-7 rounded-lg border border-slate-300 bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-700">
                    Investigation Notice
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    This represents the latest authorized known or traced
                    location available in the system. It is not real-time
                    tracking.
                  </p>

                </div>

              </div>

            </div>


            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold">
                    Location Record
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest authorized location observation
                  </p>

                </div>

                <span className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700">
                  VERIFIED SOURCE
                </span>

              </div>


              <div className="mt-5 grid grid-cols-4 gap-4">

                {[
                  ['Location', 'Ahmedabad'],
                  ['Source', 'CDR'],
                  ['Confidence', 'High'],
                  ['Status', 'Authorized'],
                ].map(([label, value]) => (

                  <div
                    key={label}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >

                    <p className="text-xs text-slate-500">
                      {label}
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {value}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </section>
        )}


        {/* ================= ANALYTICS ================= */}

        {activePage === 'Analytics' && (
          <section>

            <header className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Analytics
              </h2>

              <p className="mt-1 text-slate-600">
                Investigation analytics and temporal intelligence.
              </p>

            </header>


            <div className="grid grid-cols-3 gap-5">

              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Connected Entities
                </p>

                <p className="mt-2 text-3xl font-bold">
                  47
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Potential Bridges
                </p>

                <p className="mt-2 text-3xl font-bold">
                  6
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Cross-Case Links
                </p>

                <p className="mt-2 text-3xl font-bold">
                  12
                </p>

              </div>

            </div>

          </section>
        )}
{/* ================= SIMILARITY ANALYSIS ================= */}

{activePage === 'Similarity' && (
  <section>
    <header className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900">
        Similarity Analysis
      </h2>
      <div className="mb-6">
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Select Entity
  </label>

  <select
    value={similarityEntityId}
    onChange={(e) => setSimilarityEntityId(e.target.value)}
    className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  >
    {entities
      .filter((entity) => entity.type === 'Person')
      .map((entity) => (
        <option key={entity.id} value={entity.id}>
          {entity.label}
        </option>
      ))}
  </select>
</div>

      <p className="mt-1 text-slate-600">
        Compare entities and records using multiple analytical similarity factors.
      </p>
    </header>

    {/* FILTER PANEL */}

    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="similarity-type"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Similarity Category
          </label>

          <select
            id="similarity-type"
            value={similarityType}
            onChange={(event) => setSimilarityType(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Factors</option>
            <option value="Identity">Identity</option>
            <option value="Location">Location</option>
            <option value="Communication">Communication</option>
            <option value="Financial">Financial</option>
            <option value="Network">Network</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="similarity-threshold"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Minimum Similarity: {similarityThreshold}%
          </label>

          <input
            id="similarity-threshold"
            type="range"
            min="50"
            max="95"
            step="5"
            value={similarityThreshold}
            onChange={(event) => setSimilarityThreshold(event.target.value)}
            className="mt-3 w-full accent-blue-600"
          />
        </div>
      </div>
    </div>

    {/* RESULTS */}

    <div className="mt-6 space-y-4">
      {filteredSimilarityResults.map((result) => (
        <div
          key={result.entityId}
          className="rounded-xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {result.entityName}
                </h3>

                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {result.entityType}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Potentially similar entity — review required
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-blue-700">
                {result.score}%
              </p>

              <p className="text-xs text-slate-500">
                Overall similarity
              </p>
            </div>
          </div>

          {/* FACTORS */}

          <div className="mt-6 grid grid-cols-5 gap-3">
            {[
              ['Identity', result.identity],
              ['Location', result.location],
              ['Communication', result.communication],
              ['Financial', result.financial],
              ['Network', result.network],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs text-slate-500">
                  {label}
                </p>

                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {value}%
                </p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* WHY SIMILAR */}

          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              Why considered similar?
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              {result.reason}
            </p>
          </div>
        </div>
      ))}

      {filteredSimilarityResults.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-medium text-slate-700">
            No similarity results found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try lowering the similarity threshold or changing the category.
          </p>
        </div>
      )}
    </div>

    {/* DISCLAIMER */}

    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <p className="text-sm font-semibold text-amber-900">
        Investigation Notice
      </p>

      <p className="mt-1 text-sm leading-6 text-amber-800">
        Similarity scores are analytical indicators based on available
        information. They do not establish guilt, criminal responsibility,
        identity, or direct involvement. Investigators must review the
        underlying records and evidence.
      </p>
    </div>
  </section>
)}

        {/* ================= WOMEN SAFETY ================= */}

        {activePage === 'WomenSafety' && (
          <section>

            <header className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Women Safety Intelligence
              </h2>

              <p className="mt-1 text-slate-600">
                Case-centric intelligence for women safety investigations.
              </p>

            </header>


            <div className="grid grid-cols-3 gap-5">

              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Cross-Case Connections
                </p>

                <p className="mt-2 text-3xl font-bold">
                  8
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Potential shared entities across cases
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Repeated Locations
                </p>

                <p className="mt-2 text-3xl font-bold">
                  5
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Locations requiring investigator review
                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Potential Patterns
                </p>

                <p className="mt-2 text-3xl font-bold">
                  11
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Analytical indicators
                </p>

              </div>

            </div>


            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">

              <h3 className="text-lg font-semibold">
                Investigation Notice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                These indicators are intended to support investigators in
                identifying potential connections and recurring patterns.
                They do not establish guilt, criminal responsibility, or
                direct involvement.
              </p>

            </div>

          </section>
        )}

      </main>
    </div>
  )
}

export default App
