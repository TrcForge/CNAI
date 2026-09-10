import { useMemo, useState } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'

type NetworkNode = {
  id: string
  name: string
  type: string
  status: string
  location: string
  role: string
  description: string
}

type NetworkLink = {
  source: string
  target: string
  relationship: string
}

type GraphData = {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

const graphData: GraphData = {
  nodes: [
    {
      id: 'person1',
      name: 'Vikram',
      type: 'Person',
      status: 'Active',
      location: 'New Delhi, India',
      role: 'Associate',
      description: 'Associated with multiple entities in the investigation.',
    },
    {
      id: 'person2',
      name: 'Rajesh',
      type: 'Person',
      status: 'Active',
      location: 'New Delhi, India',
      role: 'Contact',
      description: 'Potential contact identified across cases.',
    },
    {
      id: 'person3',
      name: 'Sandeep',
      type: 'Person',
      status: 'Active',
      location: 'New Delhi, India',
      role: 'Key Suspect',
      description:
        'Possible coordinator in the network. Linked with multiple entities across different locations.',
    },
    {
      id: 'person4',
      name: 'Pooja',
      type: 'Person',
      status: 'Under Review',
      location: 'Gurugram, India',
      role: 'Contact',
      description: 'Potentially connected through communication records.',
    },
    {
      id: 'person5',
      name: 'Neha',
      type: 'Person',
      status: 'Active',
      location: 'Noida, India',
      role: 'Associate',
      description: 'Associated entity requiring further review.',
    },
    {
      id: 'person6',
      name: 'Karan',
      type: 'Person',
      status: 'Active',
      location: 'Gurugram, India',
      role: 'Business Partner',
      description: 'Business relationship identified in available records.',
    },
    {
      id: 'person7',
      name: 'Rohit',
      type: 'Person',
      status: 'Active',
      location: 'New Delhi, India',
      role: 'Associate',
      description: 'Associated through multiple relationship records.',
    },
    {
      id: 'person8',
      name: 'Amit',
      type: 'Person',
      status: 'Under Review',
      location: 'Delhi, India',
      role: 'Friend',
      description: 'Potential personal association.',
    },
  ],

  links: [
    {
      source: 'person1',
      target: 'person2',
      relationship: 'Associate',
    },
    {
      source: 'person2',
      target: 'person3',
      relationship: 'Contact',
    },
    {
      source: 'person3',
      target: 'person4',
      relationship: 'Contact',
    },
    {
      source: 'person4',
      target: 'person5',
      relationship: 'Associate',
    },
    {
      source: 'person4',
      target: 'person6',
      relationship: 'Business Partner',
    },
    {
      source: 'person3',
      target: 'person7',
      relationship: 'Associate',
    },
    {
      source: 'person7',
      target: 'person6',
      relationship: 'Associate',
    },
    {
      source: 'person3',
      target: 'person8',
      relationship: 'Friend',
    },
  ],
}

function shortName(name: string) {
  if (name.length <= 9) {
    return name
  }

  return `${name.slice(0, 8)}…`
}

function createNodeObject(node: NetworkNode) {
  // Main node sphere
  const geometry = new THREE.SphereGeometry(8, 32, 32)

  const material = new THREE.MeshStandardMaterial({
    color: 0x1683ff,
    emissive: 0x064ea8,
    emissiveIntensity: 0.8,
    metalness: 0.15,
    roughness: 0.25,
  })

  const sphere = new THREE.Mesh(geometry, material)

  // Name only — no description inside node
  const label = new SpriteText(shortName(node.name))

  label.color = '#ffffff'
  label.textHeight = 3
  label.backgroundColor = 'rgba(0,0,0,0)'
  label.padding = 0

  // Keep text centered on the node
  label.position.set(0, 0, 8.5)

  sphere.add(label)

  return sphere
}

function Network3D() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)

  const data = useMemo(() => graphData, [])

  return (
    <div className="relative h-[680px] w-full overflow-hidden rounded-2xl border border-slate-700 bg-[#061a2e] shadow-xl">

      {/* Case information */}
      <div className="absolute left-5 top-5 z-10 rounded-xl border border-blue-400/30 bg-[#0b2947]/90 px-5 py-4 text-white shadow-lg backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />

          <span className="text-sm font-semibold">
            CASE-2026-0142
          </span>
        </div>

        <div className="mt-2 text-xs text-blue-100">
          12 Entities&nbsp;&nbsp;•&nbsp;&nbsp;4 Connections
        </div>
      </div>

      {/* 3D Graph */}
      <ForceGraph3D
        graphData={data}
        backgroundColor="#232629"
       nodeLabel={(node) => {
  const n = node as NetworkNode

  return `
    <div style="
      background: #0b2947;
      color: white;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #278cff;
      font-family: Arial, sans-serif;
      font-size: 12px;
      max-width: 180px;
    ">
      <strong>${n.name}</strong>
      <br />
      <span style="color:#8fc7ff">${n.type}</span>
      <br />
      <span>${n.role}</span>
      <br />
      <span>${n.location}</span>
    </div>
  `
}}
        nodeThreeObject={(node) =>
          createNodeObject(node as NetworkNode)
        }
        nodeThreeObjectExtend={false}
        nodeRelSize={8}
        linkColor={() => '#3b9cff'}
        linkWidth={1.5}
        linkOpacity={0.75}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={0.006}
       onNodeClick={(node) => {
  const selected = node as NetworkNode

  console.log('Node clicked:', selected.name)

  setSelectedNode(selected)
}}
        onBackgroundClick={() => {
          setSelectedNode(null)
        }}
        enableNodeDrag
        enableNavigationControls
        showNavInfo={false}
        warmupTicks={100}
        cooldownTicks={80}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.25}
      />

      {/* Bottom controls */}
      <div className="absolute bottom-5 left-5 z-10 rounded-lg border border-blue-400/20 bg-[#0b2947]/90 px-4 py-3 text-xs text-blue-100 backdrop-blur">
        🖱 Drag to rotate&nbsp;&nbsp;&nbsp; 🔍 Scroll to zoom&nbsp;&nbsp;&nbsp; ✋ Right click to pan
      </div>

      {/* Selected Entity */}
      {selectedNode && (
        <div className="absolute right-5 top-5 z-20 h-[590px] w-[350px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">

          <div className="flex items-start justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-xl font-semibold text-white">
                {selectedNode.name.charAt(0)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="text-2xl text-slate-400 hover:text-slate-700"
              aria-label="Close entity details"
            >
              ×
            </button>
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            {selectedNode.name}
          </h2>

          <span className="mt-2 inline-block rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {selectedNode.type}
          </span>

          <div className="mt-6 space-y-4 text-sm">

            <div>
              <p className="text-slate-500">Status</p>

              <span className="mt-1 inline-block rounded-md bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                {selectedNode.status}
              </span>
            </div>

            <div>
              <p className="text-slate-500">Role</p>

              <p className="mt-1 font-medium text-slate-800">
                {selectedNode.role}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Location</p>

              <p className="mt-1 font-medium text-slate-800">
                {selectedNode.location}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Description</p>

              <p className="mt-1 leading-6 text-slate-700">
                {selectedNode.description}
              </p>
            </div>

          </div>

          <div className="mt-7 border-t border-slate-200 pt-5">

            <h3 className="text-sm font-semibold text-slate-800">
              Connections
            </h3>

            <div className="mt-3 space-y-3">

              {data.links
                .filter(
                  (link) =>
                    link.source === selectedNode.id ||
                    link.target === selectedNode.id,
                )
                .map((link, index) => {
                  const otherId =
                    link.source === selectedNode.id
                      ? link.target
                      : link.source

                  const otherNode = data.nodes.find(
                    (n) => n.id === otherId,
                  )

                  if (!otherNode) {
                    return null
                  }

                  return (
                    <div
                      key={`${otherId}-${index}`}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <div className="flex items-center gap-3">

                        <span className="h-3 w-3 rounded-full bg-blue-500" />

                        <span className="font-medium text-slate-800">
                          {otherNode.name}
                        </span>

                      </div>

                      <span className="text-xs text-slate-500">
                        {link.relationship}
                      </span>
                    </div>
                  )
                })}

            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            View Full Details
          </button>

        </div>
      )}
    </div>
  )
}

export default Network3D