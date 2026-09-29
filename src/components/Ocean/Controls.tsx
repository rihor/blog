import { useCallback, useEffect, useState } from 'react'

import styles from './Controls.module.scss'
import type { ControlSpec, OceanParams } from './params'
import {
  OCEAN_CONTROLS,
  OCEAN_DEFAULTS,
  oceanParams,
  useOceanParams
} from './params'

function decimals(step: number): number {
  const text = String(step)
  return text.includes('.') ? text.split('.')[1].length : 0
}

/** Only the values that differ from the defaults, so the paste stays short */
function changedFrom(params: OceanParams): Partial<OceanParams> {
  const out: Partial<OceanParams> = {}
  for (const key of Object.keys(params) as (keyof OceanParams)[]) {
    if (params[key] !== OCEAN_DEFAULTS[key])
      (out as Record<string, unknown>)[key] = params[key]
  }
  return out
}

// Handlers are module-level (stable across renders); the input's id carries
// which parameter it edits
const keyOf = (el: HTMLElement) => el.dataset.key as keyof OceanParams

const onColor = (e: React.ChangeEvent<HTMLInputElement>) =>
  oceanParams.set({ [keyOf(e.currentTarget)]: e.currentTarget.value })

const onRange = (e: React.ChangeEvent<HTMLInputElement>) =>
  oceanParams.set({ [keyOf(e.currentTarget)]: Number(e.currentTarget.value) })

const onResetOne = (e: React.MouseEvent<HTMLInputElement>) => {
  const key = keyOf(e.currentTarget)
  oceanParams.set({ [key]: OCEAN_DEFAULTS[key] })
}

const Control: React.FC<{ spec: ControlSpec; params: OceanParams }> = ({
  spec,
  params
}) => {
  const id = `oc-${spec.key}`
  const changed = params[spec.key] !== OCEAN_DEFAULTS[spec.key]

  if ('color' in spec) {
    const value = params[spec.key]
    return (
      <div className={styles.row} data-changed={changed}>
        <label htmlFor={id}>{spec.label}</label>
        <input
          id={id}
          data-key={spec.key}
          type="color"
          value={value}
          onChange={onColor}
        />
        <output htmlFor={id}>{value}</output>
      </div>
    )
  }

  const value = params[spec.key]
  return (
    <div className={styles.row} data-changed={changed}>
      <label htmlFor={id}>{spec.label}</label>
      <input
        id={id}
        data-key={spec.key}
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        onChange={onRange}
        onDoubleClick={onResetOne}
      />
      <output htmlFor={id}>{value.toFixed(decimals(spec.step))}</output>
    </div>
  )
}

/**
 * Tuning panel for the ocean scene. "Copiar" puts the edited values on the
 * clipboard as JSON, ready to paste back into the chat / code.
 */
const OceanControls: React.FC = () => {
  useEffect(() => oceanParams.enableTuning(), [])
  const params = useOceanParams()
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState<'changed' | 'all' | null>(null)

  const copy = useCallback(
    async (which: 'changed' | 'all') => {
      const data = which === 'all' ? params : changedFrom(params)
      const text = JSON.stringify(data, null, 2)
      try {
        await navigator.clipboard.writeText(text)
        setCopied(which)
        window.setTimeout(() => setCopied(null), 1600)
      } catch {
        // Clipboard blocked: fall back to a prompt the user can copy from
        window.prompt('Copie os valores:', text)
      }
    },
    [params]
  )
  const copyChanged = useCallback(() => void copy('changed'), [copy])
  const copyAll = useCallback(() => void copy('all'), [copy])
  const toggle = useCallback(() => setOpen(o => !o), [])

  const changedCount = Object.keys(changedFrom(params)).length

  return (
    <aside className={styles.panel} data-open={open} aria-label="Controles">
      <button
        type="button"
        className={styles.toggle}
        onClick={toggle}
        aria-expanded={open}
      >
        {open ? 'Fechar controles' : 'Controles'}
      </button>

      {open && (
        <>
          <div className={styles.body}>
            {OCEAN_CONTROLS.map(group => (
              <fieldset key={group.title} className={styles.group}>
                <legend>{group.title}</legend>
                {group.controls.map(spec => (
                  <Control key={spec.key} spec={spec} params={params} />
                ))}
              </fieldset>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={copyChanged}
              disabled={changedCount === 0}
            >
              {copied === 'changed'
                ? 'Copiado'
                : `Copiar alterações (${changedCount})`}
            </button>
            <button type="button" onClick={copyAll}>
              {copied === 'all' ? 'Copiado' : 'Copiar tudo'}
            </button>
            <button type="button" onClick={oceanParams.reset}>
              Restaurar
            </button>
          </div>
          <p className={styles.note}>
            Duplo clique num controle volta ao padrão.
          </p>
        </>
      )}
    </aside>
  )
}

export default OceanControls
