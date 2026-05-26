import { useState } from 'react'
import { ListBox, GridList, Tree } from '../../components'
import { Demo, SectionHeader } from '../shared'

export function ListBoxSection() {
  const [single, setSingle] = useState<string>('react')
  const [multi, setMulti] = useState(new Set(['ts']))
  return (
    <div className="space-y-6">
      <SectionHeader title="ListBox" description="Accessible selectable list with keyboard navigation, single/multiple selection, and grouped sections." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Single selection" center={false}>
          <ListBox
            selectionMode="single"
            selectedKeys={new Set([single])}
            onSelectionChange={(keys) => setSingle([...keys][0] as string)}
            items={[
              { id: 'react', label: 'React' },
              { id: 'vue', label: 'Vue' },
              { id: 'svelte', label: 'Svelte' },
              { id: 'angular', label: 'Angular', disabled: true },
            ]}
          />
        </Demo>
        <Demo label="Multiple selection" center={false}>
          <ListBox
            selectionMode="multiple"
            selectedKeys={multi}
            onSelectionChange={(keys) => setMulti(new Set(keys as Set<string>))}
            items={[
              { id: 'ts', label: 'TypeScript', description: 'Typed superset of JS' },
              { id: 'tw', label: 'Tailwind CSS', description: 'Utility-first CSS' },
              { id: 'vite', label: 'Vite', description: 'Next-gen build tool' },
              { id: 'zod', label: 'Zod', description: 'TypeScript-first schema' },
            ]}
          />
        </Demo>
        <Demo label="With sections" center={false} className="col-span-full">
          <ListBox
            selectionMode="single"
            items={[
              { id: 'frontend', title: 'Frontend', items: [
                { id: 'react2', label: 'React' },
                { id: 'next', label: 'Next.js' },
              ]},
              { id: 'backend', title: 'Backend', items: [
                { id: 'node', label: 'Node.js' },
                { id: 'go', label: 'Go' },
                { id: 'rust', label: 'Rust', disabled: true },
              ]},
            ]}
          />
        </Demo>
      </div>
    </div>
  )
}

export function GridListSection() {
  const [selected, setSelected] = useState(new Set(['b']))
  return (
    <div className="space-y-6">
      <SectionHeader title="GridList" description="Selectable list with checkbox indicators — ideal for multi-select data lists." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Single selection" center={false}>
          <GridList
            selectionMode="single"
            selectedKeys={selected}
            onSelectionChange={(keys) => setSelected(new Set(keys as Set<string>))}
            items={[
              { id: 'a', label: 'Alice Nguyen', description: 'alice@example.com' },
              { id: 'b', label: 'Bob Tran', description: 'bob@example.com' },
              { id: 'c', label: 'Carol Le', description: 'carol@example.com' },
            ]}
          />
        </Demo>
        <Demo label="Multiple selection" center={false}>
          <GridList
            selectionMode="multiple"
            defaultSelectedKeys={new Set(['x', 'z'])}
            items={[
              { id: 'x', label: 'Invoice #1001', description: '₫12,000,000' },
              { id: 'y', label: 'Invoice #1002', description: '₫8,500,000' },
              { id: 'z', label: 'Invoice #1003', description: '₫22,000,000' },
              { id: 'w', label: 'Invoice #1004', description: '₫5,000,000', disabled: true },
            ]}
          />
        </Demo>
      </div>
    </div>
  )
}

export function TreeSection() {
  const TREE_DATA = [
    { id: 'src', label: 'src', children: [
      { id: 'components', label: 'components', children: [
        { id: 'button', label: 'button.tsx' },
        { id: 'input',  label: 'input.tsx'  },
        { id: 'modal',  label: 'modal.tsx'  },
      ]},
      { id: 'lib', label: 'lib', children: [
        { id: 'cn',   label: 'cn.ts'   },
        { id: 'size', label: 'size.ts' },
      ]},
      { id: 'app', label: 'app.tsx' },
    ]},
    { id: 'public', label: 'public', children: [
      { id: 'favicon', label: 'favicon.svg' },
    ]},
    { id: 'pkg', label: 'package.json' },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Tree" description="Hierarchical data with expand/collapse and optional keyboard selection." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="File tree — no selection" center={false}>
          <div className="border border-gray-200 rounded-[var(--base-radius)] bg-white p-1 w-full">
            <Tree items={TREE_DATA} />
          </div>
        </Demo>
        <Demo label="With single selection" center={false}>
          <div className="border border-gray-200 rounded-[var(--base-radius)] bg-white p-1 w-full">
            <Tree items={TREE_DATA} selectionMode="single" defaultSelectedKeys={new Set(['button'])} />
          </div>
        </Demo>
        <Demo label="With multiple selection" center={false} className="col-span-full">
          <div className="border border-gray-200 rounded-[var(--base-radius)] bg-white p-1 w-full">
            <Tree items={TREE_DATA} selectionMode="multiple" defaultSelectedKeys={new Set(['input', 'cn'])} />
          </div>
        </Demo>
      </div>
    </div>
  )
}
