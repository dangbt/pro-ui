import { useState } from 'react'
import { Plus, Download, RefreshCw, Trash2, Upload, Image } from 'lucide-react'
import {
  Button, Input, Textarea, NumberField, SearchField,
  Select, AsyncSelect, ComboBox, Checkbox, CheckboxGroup, RadioGroup,
  Switch, Slider, DatePicker, DateRangePicker, DateField, Calendar, RangeCalendar,
  TagGroup, TimeField, ToggleButton, ToggleButtonGroup, FileTrigger, Autocomplete,
} from '../../components'
import type { TagItem } from '../../components'
import { today, getLocalTimeZone, isWeekend } from '@internationalized/date'
import { Demo, SectionHeader } from '../shared'
import { useShowcaseSize } from '../context'
import { COUNTRIES, USERS_ASYNC, fakeSearch } from '../mock-data'

export function ButtonSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Button" description="Accessible button built on React Aria — supports variants, sizes, icon slots, and disabled/loading states." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="variant='primary'">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size={size}>Primary</Button>
            <Button variant="primary" size={size} isDisabled>Disabled</Button>
          </div>
        </Demo>

        <Demo label="variant='secondary'">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size={size}>Secondary</Button>
            <Button variant="secondary" size={size} isDisabled>Disabled</Button>
          </div>
        </Demo>

        <Demo label="variant='ghost'">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" size={size}>Ghost</Button>
            <Button variant="ghost" size={size} isDisabled>Disabled</Button>
          </div>
        </Demo>

        <Demo label="variant='danger'">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="danger" size={size}>Danger</Button>
            <Button variant="danger" size={size} isDisabled>Disabled</Button>
          </div>
        </Demo>

        <Demo label="Sizes" className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary" size="md">Medium</Button>
            <Button variant="secondary" size="lg">Large</Button>
          </div>
        </Demo>

        <Demo label="With icon (icon prop)">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size={size} icon={<Plus className="w-4 h-4" />}>Add item</Button>
            <Button variant="secondary" size={size} icon={<Download className="w-4 h-4" />}>Export</Button>
            <Button variant="ghost" size={size} icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
          </div>
        </Demo>

        <Demo label="Icon only">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary"   size={size} aria-label="Add"><Plus       className="w-4 h-4" /></Button>
            <Button variant="secondary" size={size} aria-label="Download"><Download  className="w-4 h-4" /></Button>
            <Button variant="ghost"     size={size} aria-label="Refresh"><RefreshCw  className="w-4 h-4" /></Button>
            <Button variant="danger"    size={size} aria-label="Delete"><Trash2     className="w-4 h-4" /></Button>
          </div>
        </Demo>

        <Demo label="All variants — side by side" className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary"   size={size}>Primary</Button>
            <Button variant="secondary" size={size}>Secondary</Button>
            <Button variant="ghost"     size={size}>Ghost</Button>
            <Button variant="danger"    size={size}>Danger</Button>
          </div>
        </Demo>

      </div>
    </div>
  )
}

export function ToggleButtonSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="ToggleButton" description="Accessible press-to-toggle button built on React Aria — supports single and multi-select groups." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="ToggleButton — standalone">
          <div className="flex flex-wrap gap-2">
            <ToggleButton size={size}>Bold</ToggleButton>
            <ToggleButton size={size} defaultSelected>Italic</ToggleButton>
            <ToggleButton size={size}>Underline</ToggleButton>
          </div>
        </Demo>

        <Demo label="ToggleButton — disabled">
          <div className="flex gap-2">
            <ToggleButton size={size} isDisabled>Disabled off</ToggleButton>
            <ToggleButton size={size} isDisabled defaultSelected>Disabled on</ToggleButton>
          </div>
        </Demo>

        <Demo label="ToggleButtonGroup — single select" className="sm:col-span-2">
          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['grid']}>
            <ToggleButton id="list" size={size}>List</ToggleButton>
            <ToggleButton id="grid" size={size}>Grid</ToggleButton>
            <ToggleButton id="kanban" size={size}>Kanban</ToggleButton>
          </ToggleButtonGroup>
        </Demo>

        <Demo label="ToggleButtonGroup — multi select" className="sm:col-span-2">
          <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['bold', 'italic']}>
            <ToggleButton id="bold"      size={size}>Bold</ToggleButton>
            <ToggleButton id="italic"    size={size}>Italic</ToggleButton>
            <ToggleButton id="underline" size={size}>Underline</ToggleButton>
            <ToggleButton id="strike"    size={size}>Strikethrough</ToggleButton>
          </ToggleButtonGroup>
        </Demo>

      </div>
    </div>
  )
}

export function TextInputsSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Text Inputs" description="Accessible text entry components built on React Aria TextField." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Input" center={false}><Input size={size} label="Label" placeholder="Placeholder text..." className="w-full" /></Demo>
        <Demo label="Input — disabled" center={false}><Input size={size} label="Disabled" placeholder="Not editable" isDisabled className="w-full" /></Demo>
        <Demo label="Input — readonly" center={false}><Input size={size} label="Read only" defaultValue="Read-only value" isReadOnly className="w-full" /></Demo>
        <Demo label="Textarea" center={false}><Textarea size={size} label="Message" placeholder="Write something..." rows={3} className="w-full" /></Demo>
        <Demo label="NumberField" center={false}><NumberField size={size} label="Quantity" defaultValue={1} minValue={0} maxValue={99} className="w-full" /></Demo>
        <Demo label="SearchField" center={false}><SearchField label="Search" placeholder="Search anything..." className="w-full" /></Demo>

        <Demo label="Input — sizes" center={false} className="sm:col-span-2">
          <div className="grid grid-cols-3 gap-4 w-full">
            <Input size="sm" label="Small (sm)" placeholder="sm input" className="w-full" />
            <Input size="md" label="Medium (md)" placeholder="md input" className="w-full" />
            <Input size="lg" label="Large (lg)" placeholder="lg input" className="w-full" />
          </div>
        </Demo>

        <Demo label="NumberField — sizes" center={false} className="sm:col-span-2">
          <div className="grid grid-cols-3 gap-4 w-full">
            <NumberField size="sm" label="Small (sm)" defaultValue={1} className="w-full" />
            <NumberField size="md" label="Medium (md)" defaultValue={1} className="w-full" />
            <NumberField size="lg" label="Large (lg)" defaultValue={1} className="w-full" />
          </div>
        </Demo>
      </div>
    </div>
  )
}

export function SelectSection() {
  const size = useShowcaseSize()
  const [controlled, setControlled] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <SectionHeader title="Select & ComboBox" description="Dropdown selection and autocomplete inputs." />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Select</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Demo label="Select" center={false}>
            <Select
              size={size}
              label="Framework"
              placeholder="Choose one..."
              className="w-full"
              options={[
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
                { value: 'svelte', label: 'Svelte' },
                { value: 'angular', label: 'Angular' },
              ]}
            />
          </Demo>
          <Demo label="Select — with default" center={false}>
            <Select
              size={size}
              label="Status"
              defaultSelectedKey="active"
              className="w-full"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
              ]}
            />
          </Demo>
          <Demo label="ComboBox — autocomplete" center={false}>
            <ComboBox
              label="Language"
              placeholder="Type to filter..."
              className="w-full"
              options={[
                { value: 'js', label: 'JavaScript' },
                { value: 'ts', label: 'TypeScript' },
                { value: 'py', label: 'Python' },
                { value: 'rs', label: 'Rust' },
                { value: 'go', label: 'Go' },
                { value: 'kt', label: 'Kotlin' },
              ]}
            />
          </Demo>
          <Demo label="Select — disabled" center={false}>
            <Select size={size} label="Region" placeholder="Select region..." isDisabled className="w-full"
              options={[{ value: 'vn', label: 'Vietnam' }]}
            />
          </Demo>
          <Demo label="Select — sizes" center={false} className="sm:col-span-2">
            <div className="grid grid-cols-3 gap-4 w-full">
              {(['sm', 'md', 'lg'] as const).map(s => (
                <Select
                  key={s}
                  size={s}
                  label={`${s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'} (${s})`}
                  placeholder="Select..."
                  className="w-full"
                  options={[
                    { value: 'react',  label: 'React'   },
                    { value: 'vue',    label: 'Vue'     },
                    { value: 'svelte', label: 'Svelte'  },
                  ]}
                />
              ))}
            </div>
          </Demo>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">AsyncSelect</h3>
          <p className="text-xs text-gray-400 mt-0.5">Server-side search with debounce and infinite scroll pagination.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Demo label="AsyncSelect — country (75+ options, infinite scroll)" center={false}>
            <AsyncSelect
              size={size}
              label="Country"
              placeholder="Select country..."
              className="w-full"
              fetchOptions={p => fakeSearch(COUNTRIES, p)}
              pageSize={15}
            />
          </Demo>

          <Demo label="AsyncSelect — user search (120 records)" center={false}>
            <AsyncSelect
              size={size}
              label="Assign to"
              placeholder="Search user..."
              searchPlaceholder="Type name..."
              className="w-full"
              fetchOptions={p => fakeSearch(USERS_ASYNC, p, 300)}
              pageSize={10}
            />
          </Demo>

          <Demo label="AsyncSelect — controlled + reset" center={false}>
            <div className="space-y-3 w-full">
              <AsyncSelect
                size={size}
                label="Country"
                placeholder="Select country..."
                className="w-full"
                value={controlled}
                onChange={val => setControlled(val)}
                fetchOptions={p => fakeSearch(COUNTRIES, p)}
                pageSize={15}
              />
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onPress={() => setControlled('c66')}>
                  Set → United States
                </Button>
                <Button size="sm" variant="ghost" onPress={() => setControlled(null)}>
                  Reset
                </Button>
              </div>
              {controlled && (
                <p className="text-xs text-gray-400">value: <code className="text-primary">{controlled}</code></p>
              )}
            </div>
          </Demo>

          <Demo label="AsyncSelect — sizes" center={false}>
            <div className="space-y-3 w-full">
              {(['sm', 'md', 'lg'] as const).map(s => (
                <AsyncSelect
                  key={s}
                  size={s}
                  placeholder={`${s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'} (${s})`}
                  className="w-full"
                  fetchOptions={p => fakeSearch(COUNTRIES, p)}
                  pageSize={10}
                />
              ))}
            </div>
          </Demo>

          <Demo label="AsyncSelect — disabled" center={false}>
            <AsyncSelect
              size={size}
              label="Region"
              placeholder="Disabled"
              className="w-full"
              isDisabled
              fetchOptions={p => fakeSearch(COUNTRIES, p)}
            />
          </Demo>

          <Demo label="AsyncSelect — invalid state" center={false}>
            <AsyncSelect
              size={size}
              label="Required field"
              placeholder="Select country..."
              className="w-full"
              isInvalid
              fetchOptions={p => fakeSearch(COUNTRIES, p)}
            />
          </Demo>
        </div>
      </div>
    </div>
  )
}

export function DateSection() {
  const tz = getLocalTimeZone()
  const todayDate = today(tz)
  const size = useShowcaseSize()

  return (
    <div className="space-y-6">
      <SectionHeader title="Date & Time" description="Calendar-powered date pickers using React Aria & @internationalized/date." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="DatePicker — basic" center={false}>
          <DatePicker size={size} label="Pick a date" className="w-full" />
        </Demo>

        <Demo label="DatePicker — no future dates" center={false}>
          <DatePicker
            size={size}
            label="Up to today"
            maxValue={todayDate}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — min / max range" center={false}>
          <DatePicker
            size={size}
            label="This month only"
            minValue={todayDate.set({ day: 1 })}
            maxValue={todayDate.set({ day: 1 }).add({ months: 1 }).subtract({ days: 1 })}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — block weekends" center={false}>
          <DatePicker
            size={size}
            label="Weekdays only"
            isDateUnavailable={date => isWeekend(date, tz)}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — block specific dates" center={false}>
          <DatePicker
            size={size}
            label="Holidays blocked"
            isDateUnavailable={date =>
              ['2025-01-01', '2025-04-30', '2025-05-01', '2025-09-02'].includes(date.toString())
            }
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — disabled" center={false}>
          <DatePicker size={size} label="Disabled" isDisabled className="w-full" />
        </Demo>

        <Demo label="DateRangePicker — basic" center={false} className="col-span-full">
          <DateRangePicker size={size} label="Date range" className="w-full" />
        </Demo>

        <Demo label="DateRangePicker — no future" center={false} className="col-span-full">
          <DateRangePicker
            size={size}
            label="Historical range"
            maxValue={todayDate}
            className="w-full"
          />
        </Demo>

        <Demo label="DateField — no popup" center={false}>
          <DateField size={size} label="Exact date" className="w-full" />
        </Demo>

        <Demo label="DateField — disabled" center={false}>
          <DateField size={size} label="Disabled" isDisabled className="w-full" />
        </Demo>

        <Demo label="TimeField — basic" center={false}>
          <TimeField size={size} label="Start time" />
        </Demo>

        <Demo label="TimeField — with seconds" center={false}>
          <TimeField size={size} label="Duration" granularity="second" />
        </Demo>

        <Demo label="Calendar — standalone" center={true} className="col-span-full">
          <Calendar />
        </Demo>

        <Demo label="RangeCalendar — standalone" center={true} className="col-span-full">
          <RangeCalendar />
        </Demo>
      </div>
    </div>
  )
}

export function CheckboxSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Checkbox" description="Accessible checkbox built on React Aria — supports indeterminate state, sizes, groups, and press animation." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="States" center={false}>
          <div className="space-y-2.5">
            <Checkbox size={size}>Unchecked</Checkbox>
            <Checkbox size={size} defaultSelected>Checked</Checkbox>
            <Checkbox size={size} isIndeterminate>Indeterminate</Checkbox>
            <Checkbox size={size} isDisabled>Disabled</Checkbox>
            <Checkbox size={size} isDisabled defaultSelected>Disabled + checked</Checkbox>
          </div>
        </Demo>

        <Demo label="Sizes" center={false}>
          <div className="space-y-3">
            <Checkbox size="sm" defaultSelected>Small (sm)</Checkbox>
            <Checkbox size="md" defaultSelected>Medium (md)</Checkbox>
            <Checkbox size="lg" defaultSelected>Large (lg)</Checkbox>
          </div>
        </Demo>

        <Demo label="CheckboxGroup — vertical" center={false}>
          <CheckboxGroup
            size={size}
            label="Notify me about"
            defaultValue={['email', 'push']}
            options={[
              { value: 'email', label: 'Email' },
              { value: 'sms',   label: 'SMS' },
              { value: 'push',  label: 'Push notifications' },
              { value: 'slack', label: 'Slack', disabled: true },
            ]}
          />
        </Demo>

        <Demo label="CheckboxGroup — horizontal" center={false}>
          <CheckboxGroup
            size={size}
            label="Days available"
            defaultValue={['mon', 'wed', 'fri']}
            orientation="horizontal"
            options={[
              { value: 'mon', label: 'Mon' },
              { value: 'tue', label: 'Tue' },
              { value: 'wed', label: 'Wed' },
              { value: 'thu', label: 'Thu' },
              { value: 'fri', label: 'Fri' },
            ]}
          />
        </Demo>

      </div>
    </div>
  )
}

export function TogglesSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Toggles & Choices" description="Checkbox, radio, and switch components." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Checkbox" center={false}>
          <div className="space-y-2.5">
            <Checkbox size={size}>Accept terms and conditions</Checkbox>
            <Checkbox size={size} defaultSelected>Receive notifications</Checkbox>
            <Checkbox size={size} isIndeterminate>Indeterminate state</Checkbox>
            <Checkbox size={size} isDisabled>Disabled</Checkbox>
          </div>
        </Demo>
        <Demo label="CheckboxGroup" center={false}>
          <CheckboxGroup
            size={size}
            label="Notifications"
            defaultValue={['email']}
            options={[
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'push', label: 'Push notifications' },
              { value: 'slack', label: 'Slack', disabled: true },
            ]}
          />
        </Demo>
        <Demo label="RadioGroup" center={false}>
          <RadioGroup
            label="Subscription plan"
            defaultValue="pro"
            options={[
              { value: 'free', label: 'Free', description: 'Up to 5 projects' },
              { value: 'pro', label: 'Pro', description: 'Unlimited projects' },
              { value: 'enterprise', label: 'Enterprise', description: 'Custom limits' },
            ]}
          />
        </Demo>
        <Demo label="Switch" center={false}>
          <div className="space-y-3">
            <Switch size={size} defaultSelected>Enable dark mode</Switch>
            <Switch size={size}>Auto-save drafts</Switch>
            <Switch size={size} defaultSelected>Compact mode</Switch>
            <Switch size={size} isDisabled>Disabled</Switch>
          </div>
        </Demo>
      </div>
    </div>
  )
}

export function SliderSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Slider & Range" description="Drag-to-select range values." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Slider — default" center={false} className="!p-8">
          <Slider label="Volume" defaultValue={65} minValue={0} maxValue={100} className="w-full" />
        </Demo>
        <Demo label="Slider — step" center={false} className="!p-8">
          <Slider label="Zoom" defaultValue={50} minValue={0} maxValue={200} step={10} className="w-full" />
        </Demo>
      </div>
    </div>
  )
}

export function TagsSection() {
  const [tags, setTags] = useState<TagItem[]>([
    { id: '1', label: 'React',      color: 'primary' },
    { id: '2', label: 'TypeScript', color: 'info'    },
    { id: '3', label: 'Tailwind',   color: 'success' },
    { id: '4', label: 'Vite',       color: 'warning' },
  ])

  return (
    <div className="space-y-6">
      <SectionHeader title="Tags" description="Selectable and removable tag groups." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="TagGroup — removable" center={false}>
          <TagGroup
            label="Tech stack"
            items={tags}
            selectionMode="multiple"
            onRemove={keys => setTags(prev => prev.filter(t => keys !== 'all' && !keys.has(t.id)))}
          />
        </Demo>
        <Demo label="TagGroup — selectable" center={false}>
          <TagGroup
            label="Status filter"
            selectionMode="multiple"
            items={[
              { id: 'a', label: 'Active',   color: 'success' },
              { id: 'b', label: 'Pending',  color: 'warning' },
              { id: 'c', label: 'Inactive', color: 'default' },
              { id: 'd', label: 'Error',    color: 'danger'  },
            ]}
          />
        </Demo>
      </div>
    </div>
  )
}

export function FileSection() {
  const size = useShowcaseSize()
  const [files, setFiles] = useState<string[]>([])

  return (
    <div className="space-y-6">
      <SectionHeader title="File Upload" description="FileTrigger wraps any element to open the native file picker — compose with Button for custom upload UIs." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="FileTrigger — single file">
          <FileTrigger onSelect={list => list && setFiles(Array.from(list).map(f => f.name))}>
            <Button variant="secondary" size={size} icon={<Upload className="w-4 h-4" />}>
              Choose file
            </Button>
          </FileTrigger>
        </Demo>

        <Demo label="FileTrigger — image only">
          <FileTrigger acceptedFileTypes={['image/*']}>
            <Button variant="primary" size={size} icon={<Image className="w-4 h-4" />}>
              Upload image
            </Button>
          </FileTrigger>
        </Demo>

        <Demo label="FileTrigger — multiple files" className="sm:col-span-2" center={false}>
          <div className="space-y-3 w-full">
            <FileTrigger
              allowsMultiple
              onSelect={list => list && setFiles(Array.from(list).map(f => f.name))}
            >
              <Button variant="secondary" size={size} icon={<Upload className="w-4 h-4" />}>
                Choose files
              </Button>
            </FileTrigger>
            {files.length > 0 && (
              <ul className="text-sm text-gray-600 space-y-1">
                {files.map(f => <li key={f} className="flex items-center gap-1.5"><span className="text-primary">✓</span>{f}</li>)}
              </ul>
            )}
          </div>
        </Demo>

      </div>
    </div>
  )
}

export function AutocompleteSection() {
  const size = useShowcaseSize()
  const CITIES = [
    { id: 'hcm', label: 'Ho Chi Minh City', description: 'Southern Vietnam' },
    { id: 'hn',  label: 'Hanoi',            description: 'Northern Vietnam'  },
    { id: 'dn',  label: 'Da Nang',          description: 'Central Vietnam'   },
    { id: 'hp',  label: 'Hai Phong',        description: 'Northern port city' },
    { id: 'ct',  label: 'Can Tho',          description: 'Mekong Delta'      },
    { id: 'bh',  label: 'Bien Hoa',         description: 'Dong Nai province' },
    { id: 'vt',  label: 'Vung Tau',         description: 'Coastal city'      },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Autocomplete" description="Searchable input with a live-filtered suggestion list." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Basic autocomplete" center={false}>
          <Autocomplete label="City" placeholder="Search cities…" items={CITIES} size={size} />
        </Demo>
        <Demo label="No label" center={false}>
          <Autocomplete placeholder="Search frameworks…" size={size} items={[
            { id: 'react', label: 'React' },
            { id: 'vue',   label: 'Vue'   },
            { id: 'svelte',label: 'Svelte'},
            { id: 'solid', label: 'Solid' },
            { id: 'qwik',  label: 'Qwik'  },
          ]} />
        </Demo>
      </div>
    </div>
  )
}
