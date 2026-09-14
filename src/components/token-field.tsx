import {
  TokenField as RATokenField,
  TokenInput,
  Token,
  Label,
  Text,
  TokenFieldValue,
  type TokenFieldProps as RATokenFieldProps,
} from 'react-aria-components'
import { forwardRef, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { inputText, inputPx, labelText, type Size } from '../lib/size'

// The segment types are defined in react-stately and are NOT re-exported by
// react-aria-components, so derive them from the RAC-exported `TokenFieldValue`
// class rather than importing a deep subpath. This keeps the public value shape
// RAC's own model (a list of text/token segments).
/** A text or token segment in a {@link TokenFieldValue}. */
export type TokenFieldSegment<T = unknown> = TokenFieldValue<T>['segments'][number]
/** A token segment: `{ type: 'token', text, value? }`. */
export type TokenSegment<T = unknown> = Extract<TokenFieldSegment<T>, { type: 'token' }>
/** A plain-text segment: `{ type: 'text', text }`. */
export type TextSegment = Extract<TokenFieldSegment<unknown>, { type: 'text' }>

// Re-export the RAC value model so consumers build values with RAC's own types.
export { TokenFieldValue }

/**
 * A {@link TokenFieldValue} subclass that turns typed text into tokens — a
 * classic "tag input". It overrides RAC's `tokenize` to convert every piece
 * that is *followed by* a comma or newline into a token segment (trimmed, with
 * empty pieces dropped). The trailing piece — the text after the last delimiter,
 * with no delimiter after it — stays a plain `{ type: 'text' }` segment
 * (untrimmed) so the caret stays put and it keeps being re-tokenized as the user
 * types the next character. `createFieldValue` is overridden so every value
 * derived from typing stays a `TagFieldValue` and keeps tokenizing.
 *
 * RAC calls `tokenize` on every input change and merges the trailing text
 * segment with the new keystroke before re-tokenizing, so only committing a
 * token once a delimiter has been typed is what lets normal typing work.
 *
 * @alpha Relies on RAC's alpha `TokenField` value model, which may change.
 *
 * @example
 * ```tsx
 * const [tags, setTags] = useState(() => new TagFieldValue([]))
 * <TokenField label="Topics" value={tags} onChange={setTags} allowsNewlines />
 * // Typing "design," commits token "design"; "frontend\n" commits "frontend".
 * ```
 */
export class TagFieldValue<T = unknown> extends TokenFieldValue<T> {
  protected tokenize(text: string): TokenFieldSegment<T>[] {
    const segments: TokenFieldSegment<T>[] = []
    // Split into pieces, capturing the delimiters so we know which pieces were
    // *followed by* a comma/newline (those become tokens) versus the trailing
    // piece (no delimiter after it → stays editable text).
    const pieces = text.split(/[,\n]/)
    for (let i = 0; i < pieces.length; i++) {
      const isLast = i === pieces.length - 1
      if (isLast) {
        // Trailing, undelimited piece: keep as an untrimmed text segment so the
        // caret stays put and it re-tokenizes on the next keystroke. Drop it
        // only when empty (nothing typed after the last delimiter).
        if (pieces[i].length > 0) {
          segments.push({ type: 'text', text: pieces[i] } as TextSegment)
        }
      } else {
        // Delimited piece → a token. Trim and drop empty/whitespace-only pieces.
        const trimmed = pieces[i].trim()
        if (trimmed.length > 0) {
          segments.push({ type: 'token', text: trimmed } as TokenSegment<T>)
        }
      }
    }
    return segments
  }

  protected createFieldValue(segments: readonly TokenFieldSegment<T>[]): this {
    return new TagFieldValue(segments) as this
  }
}

interface TokenFieldProps<T = unknown>
  extends Omit<RATokenFieldProps<TokenFieldValue<T>>, 'className' | 'children'> {
  /** Field label rendered above the input. */
  label?: string
  /** Helper text rendered below the input. */
  description?: string
  /** Error message rendered below the input in the danger color. */
  errorMessage?: ReactNode
  /** Visual size — controls text size and horizontal padding. */
  size?: Size
  /** Placeholder shown when the field is empty. */
  placeholder?: string
  /** Extra classes for the outer wrapper. */
  className?: string
  /**
   * Customise how a token's content is rendered inside the chip. Receives the
   * RAC {@link TokenSegment} (`{ type: 'token', text, value? }`). Defaults to the
   * token's `text`.
   */
  renderToken?: (token: TokenSegment<T>) => ReactNode
}

/**
 * TokenField — a text input with inline, keyboard-selectable tokens (tags /
 * mentions), built on React Aria Components' `TokenField`.
 *
 * @alpha The underlying RAC `TokenField` API is alpha and may change.
 *
 * The value is RAC's `TokenFieldValue<T>` — a list of segments, each either a
 * plain-text segment (`{ type: 'text', text }`) or a token
 * (`{ type: 'token', text, value? }`). Build one with `new TokenFieldValue([...])`.
 */
export const TokenField = forwardRef<HTMLDivElement, TokenFieldProps>(function TokenField(
  {
    label,
    description,
    errorMessage,
    size = 'md',
    placeholder,
    className,
    renderToken,
    ...props
  },
  ref,
) {
  return (
    <RATokenField
      {...props}
      ref={ref}
      className={cn('flex flex-col gap-1', className)}
    >
      {label && (
        <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>
      )}
      <TokenInput
        data-placeholder={placeholder || undefined}
        className={cn(
          inputPx[size],
          inputText[size],
          'min-h-[var(--sz)] py-1.5 leading-6',
          'bg-surface border border-border text-fg',
          'rounded-[var(--base-radius)]',
          'whitespace-pre-wrap break-words',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-fg-disabled',
          'data-[focused]:outline-2 data-[focused]:outline-primary data-[focused]:outline-offset-0 data-[focused]:border-transparent',
          'data-[disabled]:bg-surface-subtle data-[disabled]:text-fg-disabled data-[disabled]:cursor-not-allowed',
          'data-[readonly]:bg-surface-subtle',
          'w-full',
        )}
      >
        {(segment: TokenSegment) => (
          <Token
            aria-label={segment.text}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 text-xs font-medium border align-middle',
              'rounded-[var(--base-radius)] outline-none cursor-default',
              'bg-primary-100 text-primary-700 border-primary-200',
              'data-[selected]:ring-2 data-[selected]:ring-primary',
              'data-[disabled]:opacity-60',
            )}
          >
            {renderToken ? renderToken(segment) : segment.text}
          </Token>
        )}
      </TokenInput>
      {description && (
        <Text slot="description" className="text-xs text-fg-muted">{description}</Text>
      )}
      {errorMessage && <span className="text-xs text-danger">{errorMessage}</span>}
    </RATokenField>
  )
}) as (<T = unknown>(
  props: TokenFieldProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string }

TokenField.displayName = 'TokenField'
