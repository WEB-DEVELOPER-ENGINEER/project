'use client'

import { useEffect, useState } from 'react'
import { useInput, InputProps } from 'react-admin'

interface CKEditorInputProps extends Omit<InputProps, 'source'> {
  source: string
  label?: string
  fullWidth?: boolean
}

export const CKEditorInput = ({ source, label, fullWidth, ...props }: CKEditorInputProps) => {
  const [Editor, setEditor] = useState<any>(null)
  const [ClassicEditor, setClassicEditor] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useInput({ source, ...props })

  useEffect(() => {
    setIsClient(true)
    
    // Dynamically import CKEditor components
    Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('@ckeditor/ckeditor5-build-classic')
    ]).then(([ckeditorReact, classicEditor]) => {
      setEditor(() => ckeditorReact.CKEditor)
      setClassicEditor(() => classicEditor.default)
    }).catch(error => {
      console.error('Failed to load CKEditor:', error)
    })
  }, [])

  if (!isClient || !Editor || !ClassicEditor) {
    return <div>Loading editor...</div>
  }

  return (
    <div style={{ 
      marginBottom: '16px',
      width: fullWidth ? '100%' : 'auto'
    }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px',
          fontWeight: 500,
          color: error ? '#d32f2f' : '#333'
        }}>
          {label}
        </label>
      )}
      <Editor
        editor={ClassicEditor}
        data={value || ''}
        onChange={(event: any, editor: any) => {
          const data = editor.getData()
          onChange(data)
        }}
        config={{
          extraPlugins: [
            function(editor: any) {
              // Custom upload adapter
              editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
                return {
                  upload: () => {
                    return loader.file.then((file: File) => {
                      return new Promise((resolve, reject) => {
                        const formData = new FormData()
                        formData.append('file', file)

                        fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData,
                        })
                          .then(response => response.json())
                          .then(result => {
                            if (result.success) {
                              resolve({
                                default: result.data.url
                              })
                            } else {
                              reject(result.error || 'Upload failed')
                            }
                          })
                          .catch(error => {
                            reject(error)
                          })
                      })
                    })
                  },
                  abort: () => {
                    // Implement abort functionality if needed
                  }
                }
              }
            }
          ],
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            '|',
            'undo',
            'redo',
          ],
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            ],
          },
          image: {
            toolbar: [
              'imageTextAlternative',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              'linkImage'
            ],
            styles: [
              'full',
              'side',
              'alignLeft',
              'alignCenter',
              'alignRight'
            ]
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableProperties',
              'tableCellProperties'
            ]
          },
          link: {
            decorators: {
              openInNewTab: {
                mode: 'manual',
                label: 'Open in a new tab',
                attributes: {
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }
              }
            }
          }
        }}
      />
      {error && (
        <div style={{ 
          color: '#d32f2f', 
          fontSize: '12px', 
          marginTop: '4px' 
        }}>
          {error.message}
        </div>
      )}
    </div>
  )
}