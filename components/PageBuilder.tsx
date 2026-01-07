'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PageBuilderProps {
  introducerId: string
  introducerSlug: string
  pageSlug?: string
  stepNumber?: number
}

export default function PageBuilder({ 
  introducerId, 
  introducerSlug,
  pageSlug = '',
  stepNumber = 0
}: PageBuilderProps) {
  const editorRef = useRef<any>(null)
  const [editor, setEditor] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Dynamically import GrapesJS (client-side only)
    const initEditor = async () => {
      const grapesjs = (await import('grapesjs')).default
      const gjsPresetWebpage = (await import('grapesjs-preset-webpage')).default

      const editorInstance = grapesjs.init({
        container: '#gjs',
        height: '100vh',
        width: 'auto',
        
        // Storage configuration
        storageManager: {
          type: 'remote',
          autosave: false,
          autoload: true,
          
          urlStore: `/api/builder/save?introducer=${introducerId}&slug=${pageSlug || introducerSlug}&step=${stepNumber}`,
          urlLoad: `/api/builder/load?introducer=${introducerId}&slug=${pageSlug || introducerSlug}&step=${stepNumber}`,
          
          headers: {
            'Content-Type': 'application/json',
          },
          
          onStore: (data: any) => ({ data: JSON.stringify(data) }),
          onLoad: (result: any) => JSON.parse(result.data),
        },

        // Plugins
        plugins: [gjsPresetWebpage],
        pluginsOpts: {
          gjsPresetWebpage: {
            blocks: ['column1', 'column2', 'column3', 'text', 'link', 'image', 'video', 'map'],
            modalImportTitle: 'Import Template',
            modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
            modalImportContent: (editor: any) => {
              return editor.getHtml() + '<style>' + editor.getCss() + '</style>'
            },
          }
        },

        // Canvas configuration
        canvas: {
          styles: [
            'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
          ],
        },

        // Block Manager
        blockManager: {
          appendTo: '#blocks',
        },

        // Layer Manager
        layerManager: {
          appendTo: '#layers',
        },

        // Style Manager
        styleManager: {
          appendTo: '#styles',
          sectors: [
            {
              name: 'General',
              open: true,
              properties: ['display', 'float', 'position', 'top', 'right', 'left', 'bottom']
            },
            {
              name: 'Dimension',
              open: false,
              properties: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding']
            },
            {
              name: 'Typography',
              open: false,
              properties: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow']
            },
            {
              name: 'Decorations',
              open: false,
              properties: ['border-radius', 'border', 'box-shadow', 'background']
            },
          ]
        },

        // Trait Manager
        traitManager: {
          appendTo: '#traits',
        },

        // Panels
        panels: {
          defaults: [
            {
              id: 'basic-actions',
              el: '.panel__basic-actions',
              buttons: [
                {
                  id: 'visibility',
                  active: true,
                  className: 'btn-toggle-borders',
                  label: '<i class="fa fa-clone"></i>',
                  command: 'sw-visibility',
                },
              ],
            },
            {
              id: 'panel-devices',
              el: '.panel__devices',
              buttons: [
                {
                  id: 'device-desktop',
                  label: '<i class="fa fa-desktop"></i>',
                  command: 'set-device-desktop',
                  active: true,
                  togglable: false,
                },
                {
                  id: 'device-mobile',
                  label: '<i class="fa fa-mobile"></i>',
                  command: 'set-device-mobile',
                  togglable: false,
                },
              ],
            },
          ],
        },

        // Device Manager
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '480px',
            },
          ],
        },
      })

      // Add custom blocks
      editorInstance.BlockManager.add('form-block', {
        label: 'Form Link',
        category: 'Forms',
        content: `
          <div class="form-cta" style="padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;">
            <h2 style="color: white; margin-bottom: 20px; font-size: 32px;">Ready to Start Your Claim?</h2>
            <p style="color: white; margin-bottom: 30px; font-size: 18px;">Complete our simple form to get started</p>
            <a href="/${introducerSlug}/p1" class="btn-primary" style="display: inline-block; padding: 16px 48px; background: #ff8c00; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">Start Claim →</a>
          </div>
        `,
        attributes: { class: 'fa fa-wpforms' }
      })

      editorInstance.BlockManager.add('hero-section', {
        label: 'Hero Section',
        category: 'Sections',
        content: `
          <section style="padding: 100px 20px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);">
            <h1 style="font-size: 48px; color: #ff8c00; margin-bottom: 20px;">Have You Been Mis-Sold?</h1>
            <p style="font-size: 24px; color: #e5e5e5; margin-bottom: 40px;">Find out if you're entitled to compensation</p>
            <a href="/${introducerSlug}/p1" style="display: inline-block; padding: 20px 60px; background: #ff8c00; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 20px;">Check Eligibility</a>
          </section>
        `,
        attributes: { class: 'fa fa-star' }
      })

      // Commands
      editorInstance.Commands.add('set-device-desktop', {
        run: (editor: any) => editor.setDevice('Desktop')
      })
      
      editorInstance.Commands.add('set-device-mobile', {
        run: (editor: any) => editor.setDevice('Mobile')
      })

      setEditor(editorInstance)
      editorRef.current = editorInstance
    }

    initEditor()

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
      }
    }
  }, [introducerId, introducerSlug, pageSlug, stepNumber])

  const handleSave = async () => {
    if (!editor) return

    setSaving(true)
    setSaveStatus('saving')

    try {
      const html = editor.getHtml()
      const css = editor.getCss()
      const components = editor.getComponents()
      const styles = editor.getStyle()

      const response = await fetch('/api/builder/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          introducerId,
          slug: pageSlug || introducerSlug,
          stepNumber,
          html,
          css,
          grapesjs_data: {
            components,
            styles
          }
        })
      })

      if (response.ok) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(null), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Save failed:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    await handleSave()
    
    // Mark as published
    await fetch('/api/builder/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        introducerId,
        slug: pageSlug || introducerSlug,
        stepNumber,
        published: true
      })
    })

    alert('Page published successfully!')
  }

  const handlePreview = () => {
    const win = window.open(`/${introducerSlug}${pageSlug ? `/${pageSlug}` : ''}`, '_blank')
    win?.focus()
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-dark-card border-b border-dark-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-dark-muted hover:text-dark-text"
          >
            ← Back
          </button>
          
          <h1 className="text-xl font-bold">
            Page Builder - {introducerSlug}{pageSlug ? `/${pageSlug}` : ''}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {saveStatus === 'saved' && (
            <span className="text-green-500 text-sm">✓ Saved</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-500 text-sm">✗ Save failed</span>
          )}

          <button
            onClick={handlePreview}
            className="btn btn-secondary"
          >
            Preview
          </button>

          <button
            onClick={handleSave}
            className="btn btn-secondary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={handlePublish}
            className="btn btn-primary"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Blocks */}
        <div className="w-64 bg-dark-card border-r border-dark-border overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold mb-4">Blocks</h3>
            <div id="blocks"></div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div className="panel__basic-actions absolute top-4 left-4 z-10"></div>
          <div className="panel__devices absolute top-4 right-4 z-10"></div>
          <div id="gjs"></div>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-80 bg-dark-card border-l border-dark-border overflow-y-auto">
          <div className="p-4">
            {/* Layers */}
            <div className="mb-6">
              <h3 className="font-bold mb-4">Layers</h3>
              <div id="layers"></div>
            </div>

            {/* Traits */}
            <div className="mb-6">
              <h3 className="font-bold mb-4">Traits</h3>
              <div id="traits"></div>
            </div>

            {/* Styles */}
            <div>
              <h3 className="font-bold mb-4">Styles</h3>
              <div id="styles"></div>
            </div>
          </div>
        </div>
      </div>

      {/* GrapesJS CSS */}
      <style jsx global>{`
        .gjs-one-bg { background-color: #1a1a1a !important; }
        .gjs-two-color { color: #e5e5e5 !important; }
        .gjs-three-bg { background-color: #2a2a2a !important; }
        .gjs-four-color { color: #9a9a9a !important; }
        .gjs-block { background-color: #2a2a2a !important; color: #e5e5e5 !important; }
        .gjs-block:hover { background-color: #3a3a3a !important; }
      `}</style>
    </div>
  )
}
