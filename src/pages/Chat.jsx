import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Plus, MessageSquare as MsgIcon, Loader2 } from 'lucide-react'
import { httpGet, httpPost } from '../services/httpClient'
import api from '../api/endpoints'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

export default function Chat() {
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loadingConvos, setLoadingConvos] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadConversations() {
    setLoadingConvos(true)
    try {
      const data = await httpGet(api.chatHistory)
      setConversations(Array.isArray(data) ? data : data?.conversations || data?.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingConvos(false)
    }
  }

  async function loadMessages(convoId) {
    setSelectedId(convoId)
    setLoadingMessages(true)
    setError(null)
    try {
      const data = await httpGet(api.chatMessages(convoId))
      setMessages(Array.isArray(data) ? data : data?.messages || data?.data || [])
    } catch (err) {
      setError(err.message)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return
    const content = input.trim()
    setInput('')
    setSending(true)

    // Optimistic add
    const optimistic = { role: 'user', content, id: Date.now() }
    setMessages((prev) => [...prev, optimistic])

    try {
      const body = JSON.stringify({
        content,
        ...(selectedId ? { conversation_id: selectedId } : {}),
      })
      const result = await httpPost(api.chatMessage, { body })
      if (result?.response || result?.message) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: result.response || result.message?.content || result.message, id: Date.now() + 1 },
        ])
      }
      if (result?.conversation_id && !selectedId) {
        setSelectedId(result.conversation_id)
        loadConversations()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [input, sending, selectedId])

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl gap-4">
      {/* Conversations list */}
      <div className="hidden w-72 shrink-0 flex-col rounded-xl border border-border bg-card md:flex">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Conversas</h3>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedId(null); setMessages([]) }}>
            <Plus size={14} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {loadingConvos ? (
            <div className="space-y-2 p-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-center text-xs text-muted-foreground">Nenhuma conversa</p>
          ) : (
            conversations.map((c) => {
              const id = c.id || c.conversation_id
              const title = c.title || c.name || `Conversa ${id}`
              return (
                <button
                  key={id}
                  onClick={() => loadMessages(id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedId === id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MsgIcon size={14} className="shrink-0 text-muted-foreground" />
                    <span className="truncate">{title}</span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col rounded-xl border border-border bg-card">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {loadingMessages ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <Skeleton className="h-10 w-48 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              icon={MsgIcon}
              title="Nova conversa"
              description="Envie uma mensagem para iniciar uma análise com o assistente IA."
            />
          ) : (
            messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                Pensando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="border-t border-destructive/20 bg-destructive/5 px-4 py-2">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Digite sua mensagem..."
              className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              disabled={sending}
            />
            <Button onClick={handleSend} disabled={!input.trim() || sending} className="h-11 w-11 shrink-0 p-0">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
