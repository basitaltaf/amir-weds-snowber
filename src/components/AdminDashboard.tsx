import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  RiLockLine, 
  RiGroupLine, 
  RiCalendarCheckLine, 
  RiHeartLine, 
  RiMailLine, 
  RiExternalLinkLine, 
  RiArrowLeftLine, 
  RiDeleteBin7Line, 
  RiSearchLine, 
  RiCheckDoubleLine,
  RiPlayListAddLine,
  RiImageAddLine,
  RiVolumeUpLine,
  RiDownload2Line,
  RiMusic2Line,
  RiLock2Fill
} from 'react-icons/ri'
import { rsvpApi, guestbookApi, settingsApi, isSupabaseConfigured, supabase, guestUploadsApi, visitsApi, DEFAULT_CONFIG } from '../lib/supabase'
import type { RSVPData, GuestbookEntry, WeddingConfig, GuestUpload, Visit } from '../lib/supabase'

// Removed unused mobile preview imports

export const AdminDashboard: React.FC<{ config: WeddingConfig; onConfigChange: (c: WeddingConfig) => void }> = ({ 
  config, 
  onConfigChange 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<string>('')
  
  // Dashboard navigation states
  const [activeTab, setActiveTab] = useState<'rsvp' | 'guestbook' | 'uploads' | 'cms' | 'links' | 'analytics'>('rsvp')
  const [cmsSection, setCmsSection] = useState<'details' | 'family' | 'events' | 'venue' | 'gallery' | 'music' | 'memorial' | 'emergency'>('details')  
  // Database states
  const [rsvpList, setRsvpList] = useState<RSVPData[]>([])
  const [guestbookList, setGuestbookList] = useState<GuestbookEntry[]>([])
  const [guestUploadsList, setGuestUploadsList] = useState<GuestUpload[]>([])
  const [visitsList, setVisitsList] = useState<Visit[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // CMS Settings states (temp state to support live preview updates)
  const [tempConfig, setTempConfig] = useState<WeddingConfig>(config)
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false)
  const [saveStatus, setSaveStatus] = useState<string>('')

  // Guest Link Generator state
  const [linkType, setLinkType] = useState<'personalized' | 'general'>('personalized')
  const [guestNameInput, setGuestNameInput] = useState<string>('')
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [generatedLink, setGeneratedLink] = useState<string>('')
  const [linkCopied, setLinkCopied] = useState<boolean>(false)
  
  // Verify admin credentials cache
  useEffect(() => {
    const token = localStorage.getItem('admin_session')
    if (token === 'active') {
      setIsLoggedIn(true)
    }
  }, [])

  // Sync temp config if parent settings change
  useEffect(() => {
    setTempConfig(config)
  }, [config])

  // Fetch all RSVPs, Guestbook, and Guest Uploads entries
  const fetchData = async () => {
    try {
      const rsvpRes = await rsvpApi.fetchAll()
      const gbRes = await guestbookApi.fetchAll()
      const uploadsRes = await guestUploadsApi.list()
      const visitsRes = await visitsApi.fetchAll()
      if (rsvpRes.success && rsvpRes.data) {
        setRsvpList(rsvpRes.data)
      }
      if (gbRes.success && gbRes.data) {
        setGuestbookList(gbRes.data)
      }
      if (uploadsRes.success && uploadsRes.data) {
        setGuestUploadsList(uploadsRes.data)
      }
      if (visitsRes.success && visitsRes.data) {
        setVisitsList(visitsRes.data)
      }
    } catch (err) {
      console.error('Error fetching dashboard entries:', err)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()

      if (isSupabaseConfigured && supabase) {
        const channel = supabase
          .channel('admin-dashboard')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvp' }, () => fetchData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, () => fetchData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_uploads' }, () => fetchData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'visits' }, () => fetchData())
          .subscribe()

        return () => {
          supabase?.removeChannel(channel)
        }
      }
    }
  }, [isLoggedIn])

  // Auth logins
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setLoginError(error.message)
          return
        }
        localStorage.setItem('admin_session', 'active')
        setIsLoggedIn(true)
      } catch {
        setLoginError('Authentication error. Please try again.')
      }
    } else {
      setLoginError('Supabase is not configured. Please set up your environment variables.')
    }
  }

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem('admin_session')
    setIsLoggedIn(false)
  }

  // Settings configurations CRUD upserts
  const handleSaveCMS = async () => {
    setIsSavingSettings(true)
    setSaveStatus('Saving settings to server...')
    try {
      const res = await settingsApi.save(tempConfig)
      if (res.success) {
        onConfigChange(tempConfig)
        setSaveStatus('Settings saved successfully!')
        setTimeout(() => setSaveStatus(''), 3000)
      } else {
        setSaveStatus('Error saving settings. Try again.')
      }
    } catch {
      setSaveStatus('Error saving settings.')
    } finally {
      setIsSavingSettings(false)
    }
  }

  // Deletion triggers
  const handleDeleteRSVP = async (id: string) => {
    if (!window.confirm('Delete this RSVP registry entry?')) return
    const res = await rsvpApi.delete(id)
    if (res.success) {
      setRsvpList(rsvpList.filter(item => item.id !== id))
    }
  }

  const handleDeleteGuestbook = async (id: string) => {
    if (!window.confirm('Remove this guestbook blessing entry?')) return
    const res = await guestbookApi.delete(id)
    if (res.success) {
      setGuestbookList(guestbookList.filter(item => item.id !== id))
    }
  }

  const handleDeleteUpload = async (id: string) => {
    if (!window.confirm('Delete this guest uploaded photo?')) return
    const res = await guestUploadsApi.delete(id)
    if (res.success) {
      setGuestUploadsList(guestUploadsList.filter(item => item.id !== id))
    }
  }

  // Client-side CSV Exporter utility
  const handleExportCSV = () => {
    if (rsvpList.length === 0) return
    
    // Headers
    const headers = ['Guest Name', 'Phone', 'Attending', 'Guests Count', 'Message / Wish']
    
    // Rows
    const rows = rsvpList.map(rsvp => [
      `"${rsvp.guest_name.replace(/"/g, '""')}"`,
      `"${rsvp.phone}"`,
      rsvp.attending ? 'Attending' : 'Declined',
      rsvp.attending ? rsvp.num_guests : 0,
      `"${rsvp.message.replace(/"/g, '""')}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Wedding_RSVPs_${new Date().toLocaleDateString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Guest invitation custom details link and QR Codes generators
  const handleGenerateLink = () => {
    const hostUrl = window.location.origin
    let url = hostUrl
    const queryParts: string[] = []

    if (linkType === 'personalized' && guestNameInput.trim()) {
      queryParts.push(`guest=${encodeURIComponent(guestNameInput.trim())}`)
    }
    if (selectedContacts.length > 0) {
      queryParts.push(`contact=${selectedContacts.join(',')}`)
    }

    if (queryParts.length > 0) {
      url += `/?${queryParts.join('&')}`
    } else {
      url += '/'
    }

    setGeneratedLink(url)
    setLinkCopied(false)
  }

  const handleCopyLink = () => {
    if (!generatedLink) return
    navigator.clipboard.writeText(generatedLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  // Stats indicators
  const totalRsvps = rsvpList.length
  const totalAttendingGuests = rsvpList
    .filter(item => item.attending)
    .reduce((sum, item) => sum + item.num_guests, 0)
  const totalDeclined = rsvpList.filter(item => !item.attending).length
  const totalWishes = guestbookList.length

  const filteredRsvps = rsvpList.filter(rsvp => 
    rsvp.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rsvp.phone.includes(searchQuery)
  )

  const filteredGuestbook = guestbookList.filter(entry =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Subtitle translations maps for preview
  // Helper function to handle savingew
  if (!isLoggedIn) {
    return (
      <div className="min-h-[100dvh] bg-navy flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-soft-gold/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-soft-gold/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white/5 border border-soft-gold/15 p-8 rounded-3xl shadow-2xl backdrop-blur-md relative z-10 text-center"
        >
          <div className="w-14 h-14 rounded-full border border-soft-gold/30 flex items-center justify-center text-soft-gold mx-auto mb-6">
            <RiLockLine className="w-6 h-6" />
          </div>

          <h2 className="font-playfair text-2xl text-ivory tracking-wide mb-2 select-none">
            Admin Access Portal
          </h2>
          <p className="font-lora text-[11px] text-ivory/60 italic mb-8">
            Please log in to manage wedding registries & details overrides
          </p>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div>
              <label className="font-inter text-[10px] text-soft-gold uppercase tracking-wider block mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@wedding.com"
                className="w-full bg-navy/80 border border-soft-gold/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/30 focus:outline-hidden focus:border-soft-gold/50 transition-all font-inter"
              />
            </div>

            <div>
              <label className="font-inter text-[10px] text-soft-gold uppercase tracking-wider block mb-2">
                Secure Access Token
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy/80 border border-soft-gold/15 rounded-xl px-4 py-3 text-sm text-ivory placeholder-ivory/30 focus:outline-hidden focus:border-soft-gold/50 transition-all font-inter"
              />
            </div>

            {loginError && (
              <p className="text-red-400 font-lora text-[11px] leading-relaxed text-center bg-red-950/20 border border-red-950/40 py-2.5 px-3 rounded-lg">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-soft-gold text-navy rounded-full font-inter text-xs font-semibold tracking-widest uppercase hover:bg-ivory hover:scale-102 transition-all duration-300 shadow-md cursor-pointer mt-4"
            >
              Sign In to Dashboard
            </button>
          </form>

          <button
            onClick={() => { window.location.hash = '' }}
            className="inline-flex items-center gap-1.5 mt-8 font-inter text-[10px] text-ivory/40 uppercase tracking-widest hover:text-ivory transition-colors cursor-pointer"
          >
            <RiArrowLeftLine className="w-3.5 h-3.5" />
            <span>Return to Site</span>
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-navy text-ivory flex flex-col font-inter">
      {/* Dynamic top saving banner */}
      {saveStatus && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-950/90 text-emerald-300 border border-emerald-900/30 text-xs font-semibold shadow-2xl flex items-center gap-2 select-none animate-bounce">
          <RiCheckDoubleLine className="w-4 h-4" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Header bar */}
      <header className="border-b border-soft-gold/20 px-6 py-5 bg-navy/80 backdrop-blur-xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(200,160,74,0.1)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soft-gold/20 to-transparent border border-soft-gold/50 flex items-center justify-center font-playfair text-sm text-soft-gold italic shadow-[0_0_15px_rgba(200,160,74,0.2)]">
              A&S
            </div>
            <div>
              <h1 className="font-playfair text-lg sm:text-xl font-semibold tracking-wide text-ivory">
                Wedding Command Center
              </h1>
              {!isSupabaseConfigured && (
                <span className="text-[9px] text-soft-gold bg-soft-gold/10 px-2 py-0.5 rounded-full uppercase tracking-wider block mt-1 w-fit border border-soft-gold/20">
                  Offline Preview Mode
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => { window.location.hash = '' }}
              className="px-4 py-2 bg-white/5 border border-soft-gold/30 text-ivory/90 hover:text-navy hover:bg-soft-gold rounded-full font-inter text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(200,160,74,0.3)]"
            >
              Back to Invite
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/40 border border-red-900/40 text-red-300 hover:bg-red-600 hover:text-white rounded-full font-inter text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* SaaS Dashboard Body Layout */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto relative">
        
        {/* Main Controls settings panel */}
        <div className="flex-1 p-6 space-y-6 lg:p-10">
          
          {/* Metrics summary cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: RiGroupLine, label: 'Attending Guests', value: totalAttendingGuests },
              { icon: RiCalendarCheckLine, label: 'RSVPs Received', value: totalRsvps },
              { icon: RiExternalLinkLine, label: 'Declined RSVPs', value: totalDeclined },
              { icon: RiHeartLine, label: 'Wishes Count', value: totalWishes }
            ].map((metric, idx) => (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-navy to-navy/80 border border-soft-gold/20 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group hover:border-soft-gold/60 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(200,160,74,0.15)] hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-soft-gold/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-soft-gold/10 transition-colors duration-500"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-gold/20 to-transparent border border-soft-gold/30 flex items-center justify-center text-soft-gold shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <metric.icon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(200,160,74,0.5)]" />
                </div>
                <div className="relative z-10">
                  <span className="text-[10px] text-ivory/60 font-medium uppercase tracking-[0.15em] block mb-1">{metric.label}</span>
                  <span className="text-3xl font-playfair font-bold text-ivory drop-shadow-md block">{metric.value}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Tab Navigation header */}
          <section className="flex flex-wrap gap-2 bg-navy/60 backdrop-blur-sm p-2 rounded-2xl border border-soft-gold/20 shadow-inner self-start">
            {[
              { id: 'rsvp', label: 'RSVPs' },
              { id: 'guestbook', label: 'Guestbook' },
              { id: 'uploads', label: 'Guest Clicks' },
              { id: 'cms', label: 'Wedding CMS' },
              { id: 'links', label: 'Invite Links' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-soft-gold text-navy shadow-[0_0_15px_rgba(200,160,74,0.4)] scale-105' 
                    : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </section>

          {/* Settings Section Body */}
          <section className="space-y-4">
            
            {/* Tab: RSVPs */}
            {activeTab === 'rsvp' && (
              <div className="bg-white/5 border border-soft-gold/15 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative max-w-xs w-full">
                    <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/40 w-3.5 h-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search guests by name..."
                      className="w-full bg-navy/80 border border-soft-gold/15 rounded-xl pl-9 pr-4 py-2 text-xs text-ivory focus:outline-hidden focus:border-soft-gold/40 placeholder-ivory/30"
                    />
                  </div>
                  
                  <button
                    onClick={handleExportCSV}
                    disabled={rsvpList.length === 0}
                    className="px-4 py-2 rounded-xl bg-soft-gold text-navy text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-ivory transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <RiDownload2Line className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-soft-gold/20 rounded-2xl shadow-inner bg-navy/20 backdrop-blur-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-navy/80 border-b border-soft-gold/20 text-soft-gold font-bold text-[9px] uppercase tracking-[0.15em]">
                        <th className="py-4 px-5">Name</th>
                        <th className="py-4 px-5 text-center">Status</th>
                        <th className="py-4 px-5 text-center">Size</th>
                        <th className="py-4 px-5">Message / Comments</th>
                        <th className="py-4 px-5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-soft-gold/10 text-ivory/80">
                      {filteredRsvps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center font-lora italic text-ivory/40">
                            No RSVPs found
                          </td>
                        </tr>
                      ) : (
                        filteredRsvps.map((rsvp, idx) => (
                          <tr key={rsvp.id || idx} className="hover:bg-white/5 transition-colors duration-300">
                            <td className="py-4 px-5 font-playfair text-base text-ivory">{rsvp.guest_name}</td>
                            <td className="py-4 px-5 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                                rsvp.attending ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/20' : 'bg-rose-900/50 text-rose-300 border border-rose-500/20'
                              }`}>
                                {rsvp.attending ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-center font-semibold text-ivory/90">{rsvp.attending ? rsvp.num_guests : '—'}</td>
                            <td className="py-4 px-5 font-lora italic text-ivory/70 max-w-xs truncate" title={rsvp.message}>
                              {rsvp.message || '—'}
                            </td>
                            <td className="py-4 px-5 text-center">
                              <button
                                onClick={() => rsvp.id && handleDeleteRSVP(rsvp.id)}
                                disabled={!rsvp.id}
                                className="w-7 h-7 rounded-lg bg-red-950/20 text-red-300 border border-red-900/10 flex items-center justify-center hover:bg-red-900 hover:text-white transition-all mx-auto cursor-pointer disabled:opacity-40"
                              >
                                <RiDeleteBin7Line className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Guestbook */}
            {activeTab === 'guestbook' && (
              <div className="bg-white/5 border border-soft-gold/15 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="relative max-w-xs w-full">
                  <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/40 w-3.5 h-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search wishes message content..."
                    className="w-full bg-navy/80 border border-soft-gold/15 rounded-xl pl-9 pr-4 py-2 text-xs text-ivory focus:outline-hidden focus:border-soft-gold/40 placeholder-ivory/30"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {filteredGuestbook.length === 0 ? (
                    <div className="py-8 text-center font-lora italic text-ivory/40">
                      No wishes posted yet
                    </div>
                  ) : (
                    filteredGuestbook.map((entry, idx) => (
                      <div key={entry.id || idx} className="bg-navy/40 backdrop-blur-sm border border-soft-gold/20 p-5 rounded-2xl flex items-start justify-between gap-4 hover:border-soft-gold/40 transition-colors shadow-sm">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-playfair text-lg text-soft-gold font-bold">{entry.name}</span>
                            <span className="text-[10px] text-ivory/50 tracking-wider">
                              {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <p className="font-lora text-sm italic text-ivory/80 leading-relaxed">
                            “{entry.message}”
                          </p>
                        </div>
                        <button
                          onClick={() => entry.id && handleDeleteGuestbook(entry.id)}
                          disabled={!entry.id}
                          className="px-2 py-1 bg-red-950/20 text-red-300 border border-red-900/10 rounded-lg text-[9px] font-semibold uppercase tracking-wider hover:bg-red-900 hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab: Guest Clicks Uploads */}
            {activeTab === 'uploads' && (
              <div className="bg-white/5 border border-soft-gold/15 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-soft-gold/10">
                  <div>
                    <h3 className="font-playfair text-soft-gold text-sm font-semibold">Guest Clicks Gallery Review</h3>
                    <p className="text-[10px] text-ivory/50">Manage photos uploaded by guests in real-time</p>
                  </div>
                  <span className="text-[10px] text-ivory bg-soft-gold/20 px-2 py-0.5 rounded-full font-semibold">
                    {guestUploadsList.length} Clicks
                  </span>
                </div>

                {guestUploadsList.length === 0 ? (
                  <div className="py-8 text-center font-lora italic text-ivory/40">
                    No photos shared by guests yet
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {guestUploadsList.map((entry) => (
                      <div key={entry.id} className="bg-navy/80 border border-soft-gold/10 p-3 rounded-xl flex flex-col justify-between gap-3 relative group hover:border-soft-gold/30 transition-all">
                        <div className="aspect-square rounded-lg overflow-hidden bg-navy/40 relative">
                          <img src={entry.image_url} alt={entry.guest_name} className="w-full h-full object-cover" />
                          {entry.isPrivate && (
                            <div className="absolute top-2 right-2 bg-navy/90 backdrop-blur-sm text-soft-gold border border-soft-gold/30 px-2 py-1 rounded-md text-[8px] font-bold tracking-widest uppercase flex items-center gap-1">
                              <RiLock2Fill className="w-3 h-3" />
                              Private
                            </div>
                          )}
                        </div>
                        <div className="text-left space-y-1">
                          <span className="text-[10px] text-soft-gold font-bold block truncate">{entry.guest_name}</span>
                          {entry.caption && (
                            <p className="text-[9px] text-ivory/70 italic truncate">"{entry.caption}"</p>
                          )}
                          <span className="text-[8px] text-ivory/40 block">
                            {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = entry.image_url;
                              a.download = `guest-photo-${entry.guest_name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                            className="flex-1 py-1.5 bg-soft-gold/10 text-soft-gold border border-soft-gold/20 rounded-lg text-[9px] font-semibold uppercase tracking-wider hover:bg-soft-gold hover:text-navy transition-colors cursor-pointer flex items-center justify-center gap-1"
                            title="Download Photo"
                          >
                            <RiDownload2Line className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={() => entry.id && handleDeleteUpload(entry.id)}
                            className="flex-1 py-1.5 bg-red-950/40 text-red-300 border border-red-900/20 rounded-lg text-[9px] font-semibold uppercase tracking-wider hover:bg-red-900 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                            title="Remove Photo"
                          >
                            <RiDeleteBin7Line className="w-3 h-3" />
                            Del
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Wedding CMS */}
            {activeTab === 'cms' && (
              <div className="space-y-6">
                
                {/* CMS Section Selection sub-menu */}
                <div className="flex flex-wrap gap-2 border-b border-soft-gold/10 pb-3">
                  {(['details', 'family', 'events', 'venue', 'gallery', 'music', 'memorial', 'emergency'] as const).map(section => (
                    <button
                      key={section}
                      onClick={() => setCmsSection(section)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        cmsSection === section 
                          ? 'bg-soft-gold/20 text-soft-gold border-soft-gold' 
                          : 'bg-transparent text-ivory/50 border-soft-gold/10 hover:text-ivory'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>

                {/* Sub-Section Form renders */}
                <div className="bg-white/5 border border-soft-gold/15 rounded-2xl p-5 shadow-xl space-y-5">
                  
                  {/* CMS Details Panel */}
                  {cmsSection === 'details' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Groom Name</label>
                          <input
                            type="text"
                            value={tempConfig.couple.groom}
                            onChange={e => setTempConfig({
                              ...tempConfig,
                              couple: { ...tempConfig.couple, groom: e.target.value }
                            })}
                            className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Bride Name</label>
                          <input
                            type="text"
                            value={tempConfig.couple.bride}
                            onChange={e => setTempConfig({
                              ...tempConfig,
                              couple: { ...tempConfig.couple, bride: e.target.value }
                            })}
                            className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Wedding Date text (English)</label>
                        <input
                          type="text"
                          value={tempConfig.dates.mainDateEn}
                          onChange={e => setTempConfig({
                            ...tempConfig,
                            dates: { ...tempConfig.dates, mainDateEn: e.target.value }
                          })}
                          placeholder="e.g. October 1 & 2, 2026"
                          className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                        />
                      </div>



                      <div>
                        <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Countdown Target ISO datetime</label>
                        <input
                          type="text"
                          value={tempConfig.dates.countdownTarget}
                          onChange={e => setTempConfig({
                            ...tempConfig,
                            dates: { ...tempConfig.dates, countdownTarget: e.target.value }
                          })}
                          placeholder="YYYY-MM-DDTHH:MM:SS"
                          className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40 font-mono text-ivory placeholder-ivory/30"
                        />
                        <span className="text-[9px] text-ivory/40 block mt-1">Countdown timer target date. Must be formatted in standard ISO pattern (e.g. 2026-10-01T17:00:00).</span>
                      </div>

                      <div className="pt-3 border-t border-soft-gold/10">
                        <div>
                          <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Hero greeting text (English)</label>
                          <input
                            type="text"
                            value={tempConfig.hero.subtitleEn}
                            onChange={e => setTempConfig({
                              ...tempConfig,
                              hero: { ...tempConfig.hero, subtitleEn: e.target.value }
                            })}
                            className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CMS Family Panel */}
                  {cmsSection === 'family' && (
                    <div className="space-y-4">
                      {/* Groom Side List */}
                      <div>
                        <h4 className="font-playfair text-soft-gold text-sm font-semibold mb-3">Groom Family List</h4>
                        <div className="space-y-2">
                          {tempConfig.family.groomSide.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={member}
                                onChange={e => {
                                  const updated = [...tempConfig.family.groomSide]
                                  updated[idx] = e.target.value
                                  setTempConfig({
                                    ...tempConfig,
                                    family: { ...tempConfig.family, groomSide: updated }
                                  })
                                }}
                                className="flex-1 bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-1.5 text-xs focus:outline-hidden"
                              />
                              <button
                                onClick={() => {
                                  setTempConfig({
                                    ...tempConfig,
                                    family: {
                                      ...tempConfig.family,
                                      groomSide: tempConfig.family.groomSide.filter((_, i) => i !== idx)
                                    }
                                  })
                                }}
                                className="w-8 h-8 bg-red-950/20 text-red-300 border border-red-900/10 rounded-lg flex items-center justify-center hover:bg-red-900 cursor-pointer"
                              >
                                <RiDeleteBin7Line className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setTempConfig({
                                ...tempConfig,
                                family: {
                                  ...tempConfig.family,
                                  groomSide: [...tempConfig.family.groomSide, 'New Family Member']
                                }
                              })
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-soft-gold/25 text-soft-gold rounded-lg text-[9px] uppercase font-bold tracking-wider hover:bg-white/5 cursor-pointer mt-2"
                          >
                            <RiPlayListAddLine className="w-3 h-3" />
                            <span>Add Member</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CMS Events Panel */}
                  {cmsSection === 'events' && (
                    <div className="space-y-6">
                      {(['hinabandi', 'masnandnishni', 'reception_baraat'] as const).map(evtKey => (
                        <div key={evtKey} className="border-b border-soft-gold/15 pb-6 last:border-0 last:pb-0">
                          <h4 className="font-playfair text-soft-gold text-sm font-semibold capitalize mb-3">
                            {evtKey.replace('_', ' ')} Settings
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            <div>
                              <label className="text-[9px] uppercase tracking-wider block mb-1 text-ivory/50">Date (English)</label>
                              <input
                                type="text"
                                value={tempConfig.events[evtKey].dateEn}
                                onChange={e => {
                                  const updated = { ...tempConfig.events }
                                  updated[evtKey] = { ...updated[evtKey], dateEn: e.target.value }
                                  setTempConfig({ ...tempConfig, events: updated })
                                }}
                                className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden text-ivory placeholder-ivory/30"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase tracking-wider block mb-1 text-ivory/50">Date (Urdu)</label>
                              <input
                                type="text"
                                value={tempConfig.events[evtKey].dateUr}
                                onChange={e => {
                                  const updated = { ...tempConfig.events }
                                  updated[evtKey] = { ...updated[evtKey], dateUr: e.target.value }
                                  setTempConfig({ ...tempConfig, events: updated })
                                }}
                                className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-2.5 py-1.5 text-xs text-right focus:outline-hidden text-ivory placeholder-ivory/30"
                                dir="rtl"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase tracking-wider block mb-1 text-ivory/50">Start Time</label>
                              <input
                                type="text"
                                value={tempConfig.events[evtKey].time}
                                onChange={e => {
                                  const updated = { ...tempConfig.events }
                                  updated[evtKey] = { ...updated[evtKey], time: e.target.value }
                                  setTempConfig({ ...tempConfig, events: updated })
                                }}
                                className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden text-ivory placeholder-ivory/30"
                              />
                            </div>
                          </div>

                          {/* Event Timeline items CRUD */}
                          <div className="space-y-2 mt-2">
                            <label className="text-[9px] uppercase tracking-wider block mb-1 text-soft-gold font-semibold">Event Timeline Schedule</label>
                            {tempConfig.events[evtKey].items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Time (e.g. 05:00 PM)"
                                  value={item.time}
                                  onChange={e => {
                                    const items = [...tempConfig.events[evtKey].items]
                                    items[idx] = { ...items[idx], time: e.target.value }
                                    const updated = { ...tempConfig.events }
                                    updated[evtKey] = { ...updated[evtKey], items }
                                    setTempConfig({ ...tempConfig, events: updated })
                                  }}
                                  className="w-24 bg-navy/60 border border-soft-gold/15 rounded-lg px-2 py-1 text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Activity name / translation description"
                                  value={item.activity}
                                  onChange={e => {
                                    const items = [...tempConfig.events[evtKey].items]
                                    items[idx] = { ...items[idx], activity: e.target.value }
                                    const updated = { ...tempConfig.events }
                                    updated[evtKey] = { ...updated[evtKey], items }
                                    setTempConfig({ ...tempConfig, events: updated })
                                  }}
                                  className="flex-1 bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-1 text-xs"
                                />
                                <button
                                  onClick={() => {
                                    const items = tempConfig.events[evtKey].items.filter((_, i) => i !== idx)
                                    const updated = { ...tempConfig.events }
                                    updated[evtKey] = { ...updated[evtKey], items }
                                    setTempConfig({ ...tempConfig, events: updated })
                                  }}
                                  className="w-7 h-7 bg-red-950/20 text-red-300 border border-red-900/10 rounded-lg flex items-center justify-center hover:bg-red-900 cursor-pointer shrink-0"
                                >
                                  <RiDeleteBin7Line className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const items = [...tempConfig.events[evtKey].items, { time: '00:00 PM', activity: 'New Ceremony Event' }]
                                const updated = { ...tempConfig.events }
                                updated[evtKey] = { ...updated[evtKey], items }
                                setTempConfig({ ...tempConfig, events: updated })
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 border border-soft-gold/20 text-[9px] uppercase tracking-wider text-soft-gold rounded-lg hover:bg-white/5 cursor-pointer mt-1"
                            >
                              <RiPlayListAddLine className="w-3 h-3" />
                              <span>Add Timeline Activity</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CMS Venue Panel */}
                  {cmsSection === 'venue' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Venue Label (English)</label>
                          <input
                            type="text"
                            value={tempConfig.venue.titleEn}
                            onChange={e => setTempConfig({
                              ...tempConfig,
                              venue: { ...tempConfig.venue, titleEn: e.target.value }
                            })}
                            className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Venue Label (Urdu)</label>
                          <input
                            type="text"
                            value={tempConfig.venue.titleUr}
                            onChange={e => setTempConfig({
                              ...tempConfig,
                              venue: { ...tempConfig.venue, titleUr: e.target.value }
                            })}
                            className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden text-right text-ivory placeholder-ivory/30"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-soft-gold/10">
                        <div>
                          <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Latitude Coords</label>
                          <input
                            type="number"
                            step="any"
                            value={tempConfig.venue.lat}
                            onChange={e => setTempConfig({
                              ...tempConfig,
                              venue: { ...tempConfig.venue, lat: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden text-ivory placeholder-ivory/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Longitude Coords</label>
                          <input
                            type="number"
                            step="any"
                            value={tempConfig.venue.lng}
                            onChange={e => setTempConfig({
                              ...tempConfig,
                              venue: { ...tempConfig.venue, lng: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden text-ivory placeholder-ivory/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Directions Google Maps Short URL</label>
                        <input
                          type="text"
                          value={tempConfig.venue.directionsUrl}
                          onChange={e => setTempConfig({
                            ...tempConfig,
                            venue: { ...tempConfig.venue, directionsUrl: e.target.value }
                          })}
                          className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden text-ivory placeholder-ivory/30"
                        />
                      </div>

                      {/* Poem Lines */}
                      <div className="space-y-3 pt-3 border-t border-soft-gold/10">
                        <h4 className="font-playfair text-soft-gold text-xs font-semibold">Invitation Wording (English Poem)</h4>
                        {tempConfig.venue.poemLinesEn.map((line, idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={line}
                            onChange={e => {
                              const lines = [...tempConfig.venue.poemLinesEn]
                              lines[idx] = e.target.value
                              setTempConfig({
                                ...tempConfig,
                                venue: { ...tempConfig.venue, poemLinesEn: lines }
                              })
                            }}
                            className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-1.5 text-xs focus:outline-hidden text-ivory placeholder-ivory/30"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CMS Gallery Panel */}
                  {cmsSection === 'gallery' && (
                    <div className="space-y-4">
                      {/* Couple portraits configuration */}
                      <div className="border-b border-soft-gold/15 pb-4 mb-4">
                        <h4 className="font-playfair text-soft-gold text-sm font-semibold mb-3">Bride & Groom Passport Photo Assets</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] text-ivory/50 block mb-1">Groom Portrait Photo</label>
                            {tempConfig.portraits?.groom && (
                              <img src={tempConfig.portraits.groom} alt="Groom" className="w-16 h-16 rounded-full object-cover border-2 border-soft-gold/30" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setTempConfig({
                                      ...tempConfig,
                                      portraits: { ...tempConfig.portraits, groom: reader.result as string }
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="w-full text-xs text-ivory file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[9px] file:font-semibold file:bg-soft-gold file:text-navy hover:file:bg-ivory cursor-pointer transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] text-ivory/50 block mb-1">Bride Portrait Photo</label>
                            {tempConfig.portraits?.bride && (
                              <img src={tempConfig.portraits.bride} alt="Bride" className="w-16 h-16 rounded-full object-cover border-2 border-soft-gold/30" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setTempConfig({
                                      ...tempConfig,
                                      portraits: { ...tempConfig.portraits, bride: reader.result as string }
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="w-full text-xs text-ivory file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[9px] file:font-semibold file:bg-soft-gold file:text-navy hover:file:bg-ivory cursor-pointer transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <h4 className="font-playfair text-soft-gold text-sm font-semibold mb-3">Invitation Gallery Albums</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {tempConfig.gallery.map((img, idx) => (
                          <div key={idx} className="bg-navy/80 border border-soft-gold/10 p-3 rounded-xl space-y-2 relative group hover:border-soft-gold/30 transition-all">
                            <div className="aspect-[3/4] bg-navy/40 rounded-lg overflow-hidden relative">
                              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                              <button
                                onClick={() => {
                                  setTempConfig({
                                    ...tempConfig,
                                    gallery: tempConfig.gallery.filter((_, i) => i !== idx)
                                  })
                                }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-950/80 text-red-200 flex items-center justify-center hover:bg-red-900 border border-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                              >
                                <RiDeleteBin7Line className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <input
                              type="text"
                              value={img.alt}
                              placeholder="Label Name (Groom / Bride / Decor)"
                              onChange={e => {
                                  const updated = [...tempConfig.gallery]
                                  updated[idx] = { ...updated[idx], alt: e.target.value }
                                  setTempConfig({ ...tempConfig, gallery: updated })
                              }}
                              className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-2.5 py-1 text-[10px] focus:outline-hidden text-center text-ivory placeholder-ivory/30"
                            />
                          </div>
                        ))}
                      </div>

                      <label className="w-full py-4 border-2 border-dashed border-soft-gold/30 text-soft-gold hover:bg-soft-gold/10 hover:border-soft-gold rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all">
                        <RiImageAddLine className="w-5 h-5" />
                        <span>Upload New Gallery Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setTempConfig({
                                  ...tempConfig,
                                  gallery: [...tempConfig.gallery, { src: reader.result as string, alt: 'Wedding Photo' }]
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {/* Announcements Panel Removed */}

                  {/* CMS Music settings */}
                  {cmsSection === 'music' && (
                    <div className="space-y-4">
                      {/* Upload Audio File Block */}
                      <div>
                        <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5 font-bold">Upload Background Music (.mp3)</label>
                        <div className="relative border border-dashed border-soft-gold/30 hover:border-soft-gold rounded-xl p-5 bg-navy/60 text-center cursor-pointer transition-colors group">
                          <input 
                            type="file" 
                            accept="audio/mp3, audio/mpeg"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              if (file.size > 4 * 1024 * 1024) {
                                alert("Audio file is too large! Please upload a file smaller than 4MB.")
                                return
                              }
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setTempConfig({
                                  ...tempConfig,
                                  music: { ...tempConfig.music, musicUrl: reader.result as string }
                                })
                              }
                              reader.readAsDataURL(file)
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                          />
                          {tempConfig.music.musicUrl && tempConfig.music.musicUrl.startsWith('data:') ? (
                            <div className="flex flex-col items-center gap-1.5">
                              <RiVolumeUpLine className="w-6 h-6 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400 font-semibold">Custom music track uploaded!</span>
                              <span className="text-[8px] text-soft-gold/50">Saved directly in wedding configurations</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5">
                              <RiMusic2Line className="w-6 h-6 text-soft-gold group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] text-soft-gold/80 font-semibold">Click to upload background music (.mp3)</span>
                              <span className="text-[8px] text-soft-gold/40">Files up to 4MB supported</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Text URL Input (Fallback) */}
                      <div>
                        <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Or paste Audio URL link</label>
                        <input
                          type="text"
                          value={tempConfig.music.musicUrl}
                          onChange={e => setTempConfig({
                            ...tempConfig,
                            music: { ...tempConfig.music, musicUrl: e.target.value }
                          })}
                          className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs font-mono text-ivory placeholder-ivory/30"
                          placeholder="/ishq.mp3"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-navy/80 border border-soft-gold/10 rounded-xl mt-4">
                        <div className="flex items-center gap-2 text-soft-gold">
                          <RiVolumeUpLine className="w-4 h-4" />
                          <span className="text-xs font-semibold">Enable Music Autoplay request on load</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={tempConfig.music.autoPlay}
                          onChange={e => setTempConfig({
                            ...tempConfig,
                            music: { ...tempConfig.music, autoPlay: e.target.checked }
                          })}
                          className="w-4.5 h-4.5 accent-soft-gold cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* CMS Memorial Panel */}
                  {cmsSection === 'memorial' && (
                    <div className="space-y-4">
                      {/* Enable/Disable Toggle */}
                      <div className="flex items-center justify-between pb-3 border-b border-soft-gold/10">
                        <div>
                          <h4 className="font-playfair text-soft-gold text-sm font-semibold">Enable Memorial Section</h4>
                          <p className="text-[9px] text-ivory/50">Display a remembrance section honoring deceased family members.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={!!tempConfig.memorial?.enabled}
                            onChange={e => setTempConfig({
                              ...tempConfig,
                              memorial: { 
                                ...(tempConfig.memorial || DEFAULT_CONFIG.memorial || { enabled: false, titleEn: '', messageEn: '', duaEn: '', members: [] }), 
                                enabled: e.target.checked 
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-navy/60 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-soft-gold after:border-soft-gold/30 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-soft-gold/30 border border-soft-gold/20"></div>
                        </label>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Section Title</label>
                        <input
                          type="text"
                          value={tempConfig.memorial?.titleEn || ''}
                          onChange={e => setTempConfig({
                            ...tempConfig,
                            memorial: { 
                              ...(tempConfig.memorial || DEFAULT_CONFIG.memorial || { enabled: false, titleEn: '', messageEn: '', duaEn: '', members: [] }), 
                              titleEn: e.target.value 
                            }
                          })}
                          className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                        />
                      </div>

                      {/* Remembrance Message */}
                      <div>
                        <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Remembrance Message</label>
                        <textarea
                          rows={3}
                          value={tempConfig.memorial?.messageEn || ''}
                          onChange={e => setTempConfig({
                            ...tempConfig,
                            memorial: { 
                              ...(tempConfig.memorial || DEFAULT_CONFIG.memorial || { enabled: false, titleEn: '', messageEn: '', duaEn: '', members: [] }), 
                              messageEn: e.target.value 
                            }
                          })}
                          className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs font-lora leading-relaxed focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                        />
                      </div>

                      {/* Islamic Du'a */}
                      <div>
                        <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Islamic Du'a</label>
                        <input
                          type="text"
                          value={tempConfig.memorial?.duaEn || ''}
                          onChange={e => setTempConfig({
                            ...tempConfig,
                            memorial: { 
                              ...(tempConfig.memorial || DEFAULT_CONFIG.memorial || { enabled: false, titleEn: '', messageEn: '', duaEn: '', members: [] }), 
                              duaEn: e.target.value 
                            }
                          })}
                          className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                        />
                      </div>

                      {/* Deceased Members List */}
                      <div>
                        <h4 className="font-playfair text-soft-gold text-sm font-semibold mb-3">Deceased Members</h4>
                        <div className="space-y-2">
                          {(tempConfig.memorial?.members || []).map((member, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={member}
                                onChange={e => {
                                  const updated = [...(tempConfig.memorial?.members || [])]
                                  updated[idx] = e.target.value
                                  setTempConfig({
                                    ...tempConfig,
                                    memorial: {
                                      ...(tempConfig.memorial || DEFAULT_CONFIG.memorial || { enabled: false, titleEn: '', messageEn: '', duaEn: '', members: [] }),
                                      members: updated
                                    }
                                  })
                                }}
                                className="flex-1 bg-navy/60 border border-soft-gold/15 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-soft-gold/40"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (tempConfig.memorial?.members || []).filter((_, i) => i !== idx)
                                  setTempConfig({
                                    ...tempConfig,
                                    memorial: {
                                      ...(tempConfig.memorial || DEFAULT_CONFIG.memorial || { enabled: false, titleEn: '', messageEn: '', duaEn: '', members: [] }),
                                      members: updated
                                    }
                                  })
                                }}
                                className="p-2 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/10 cursor-pointer"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(tempConfig.memorial?.members || []), '']
                              setTempConfig({
                                ...tempConfig,
                                memorial: {
                                  ...(tempConfig.memorial || DEFAULT_CONFIG.memorial || { enabled: false, titleEn: '', messageEn: '', duaEn: '', members: [] }),
                                  members: updated
                                }
                              })
                            }}
                            className="w-full py-2 border border-dashed border-soft-gold/20 rounded-lg text-[10px] text-soft-gold uppercase tracking-wider font-semibold hover:bg-soft-gold/10 hover:border-soft-gold/40 transition-all cursor-pointer"
                          >
                            + Add Deceased Family Member
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CMS Emergency Contacts Panel */}
                  {cmsSection === 'emergency' && (
                    <div className="space-y-4">
                      <h4 className="font-playfair text-soft-gold text-sm font-semibold mb-1">Emergency Contacts</h4>
                      <p className="text-[9px] text-ivory/50 mb-3">Add names and phone numbers of contacts who can help guests with logistics or emergencies.</p>
                      
                      <div className="space-y-3">
                        {(tempConfig.emergencyContacts || []).map((contact, idx) => (
                          <div key={idx} className="bg-navy/40 border border-soft-gold/10 p-3 rounded-xl space-y-3 relative">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-soft-gold uppercase tracking-wider">Contact #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (tempConfig.emergencyContacts || []).filter((_, i) => i !== idx)
                                  setTempConfig({
                                    ...tempConfig,
                                    emergencyContacts: updated
                                  })
                                }}
                                className="text-[10px] text-red-400 hover:text-red-300 font-bold cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] text-ivory/50 uppercase tracking-widest block mb-1">Name</label>
                                <input
                                  type="text"
                                  value={contact.name}
                                  onChange={e => {
                                    const updated = [...(tempConfig.emergencyContacts || [])]
                                    updated[idx] = { ...updated[idx], name: e.target.value }
                                    setTempConfig({
                                      ...tempConfig,
                                      emergencyContacts: updated
                                    })
                                  }}
                                  className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                                />
                              </div>
                              
                              <div>
                                <label className="text-[8px] text-ivory/50 uppercase tracking-widest block mb-1">Phone Number</label>
                                <input
                                  type="text"
                                  value={contact.phone}
                                  onChange={e => {
                                    const updated = [...(tempConfig.emergencyContacts || [])]
                                    updated[idx] = { ...updated[idx], phone: e.target.value }
                                    setTempConfig({
                                      ...tempConfig,
                                      emergencyContacts: updated
                                    })
                                  }}
                                  className="w-full bg-navy/60 border border-soft-gold/15 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-soft-gold/40 text-ivory placeholder-ivory/30"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(tempConfig.emergencyContacts || []), { name: '', phone: '' }]
                            setTempConfig({
                              ...tempConfig,
                              emergencyContacts: updated
                            })
                          }}
                          className="w-full py-2 border border-dashed border-soft-gold/20 rounded-lg text-[10px] text-soft-gold uppercase tracking-wider font-semibold hover:bg-soft-gold/10 hover:border-soft-gold/40 transition-all cursor-pointer"
                        >
                          + Add New Emergency Contact
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t border-soft-gold/15 flex items-center justify-between">
                    <span className="text-[10px] text-ivory/50 font-lora italic">
                      * Changes will sync instantly to the mobile preview frame on the right.
                    </span>
                    <button
                      onClick={handleSaveCMS}
                      disabled={isSavingSettings}
                      className="px-6 py-2.5 bg-soft-gold text-navy rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-ivory transition-all cursor-pointer disabled:opacity-40"
                    >
                      {isSavingSettings ? 'Saving...' : 'Save Settings Changes'}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Tab: Link Generator & QR Code */}
            {activeTab === 'links' && (
              <div className="bg-white/5 border border-soft-gold/15 p-6 rounded-2xl shadow-xl space-y-6">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-soft-gold/10 flex items-center justify-center text-soft-gold mb-3 mx-auto">
                    <RiMailLine className="w-5 h-5" />
                  </div>
                  <h3 className="font-playfair text-lg text-ivory tracking-wide mb-1">Guest QR & Link Generator</h3>
                  <p className="font-lora text-[11px] text-ivory/50 italic leading-relaxed">
                    Type a guest's name to generate their customized greeting link and WhatsApp invitation QR code.
                  </p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  {/* Link Type Selector */}
                  <div className="flex bg-navy/60 p-1 rounded-xl border border-soft-gold/15 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLinkType('personalized')
                        setGeneratedLink('')
                      }}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        linkType === 'personalized'
                          ? 'bg-soft-gold text-navy shadow-md'
                          : 'text-ivory/60 hover:text-ivory'
                      }`}
                    >
                      Personalized Link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLinkType('general')
                        setGeneratedLink('')
                      }}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        linkType === 'general'
                          ? 'bg-soft-gold text-navy shadow-md'
                          : 'text-ivory/60 hover:text-ivory'
                      }`}
                    >
                      General Link
                    </button>
                  </div>

                  {linkType === 'personalized' && (
                    <div>
                      <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1.5">Guest Name</label>
                      <input
                        type="text"
                        value={guestNameInput}
                        onChange={e => setGuestNameInput(e.target.value)}
                        placeholder="e.g. Basit Altaf"
                        className="w-full bg-navy/60 border border-soft-gold/15 rounded-xl px-4 py-2.5 text-xs text-ivory focus:outline-hidden placeholder-ivory/30"
                      />
                    </div>
                  )}

                  {/* Assign Emergency Contacts Select options */}
                  {tempConfig.emergencyContacts && tempConfig.emergencyContacts.length > 0 && (
                    <div className="text-left space-y-2 pt-2 border-t border-soft-gold/10">
                      <label className="text-[10px] text-soft-gold uppercase tracking-wider block mb-1">
                        Assign Emergency Contacts (Optional)
                      </label>
                      <p className="text-[9px] text-ivory/50 mb-2 leading-relaxed">
                        Select which contacts should be shown specifically in the footer for this guest. (If none are checked, all will display).
                      </p>
                      <div className="space-y-1.5">
                        {tempConfig.emergencyContacts.map((contact, idx) => {
                          if (!contact.name) return null;
                          const isChecked = selectedContacts.includes(idx)
                          return (
                            <label key={idx} className="flex items-center gap-3 bg-navy/40 border border-soft-gold/10 p-2.5 rounded-xl cursor-pointer hover:border-soft-gold/30 transition-all select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedContacts(selectedContacts.filter(c => c !== idx))
                                  } else {
                                    setSelectedContacts([...selectedContacts, idx])
                                  }
                                }}
                                className="w-4 h-4 accent-soft-gold cursor-pointer"
                              />
                              <div className="text-[10px] text-left">
                                <span className="text-ivory font-semibold block">{contact.name}</span>
                                <span className="text-ivory/50 block font-mono text-[9px]">{contact.phone}</span>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateLink}
                    disabled={linkType === 'personalized' ? !guestNameInput.trim() : false}
                    className="w-full py-3 bg-soft-gold text-navy rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-ivory hover:scale-102 transition-all cursor-pointer disabled:opacity-40"
                  >
                    Generate Invitation Details
                  </button>

                  {generatedLink && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-navy/60 border border-soft-gold/15 p-4 rounded-xl space-y-5 text-center flex flex-col items-center"
                    >
                      {/* Personal QR Code rendering */}
                      <div className="bg-white p-3 rounded-2xl shadow-lg border border-soft-gold/20">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generatedLink)}`} 
                          alt="Guest RSVP QR Code" 
                          className="w-36 h-36 select-none"
                        />
                      </div>
                      
                      <div className="w-full space-y-2">
                        <span className="text-[9px] text-soft-gold uppercase tracking-wider block">Custom URL Link:</span>
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            readOnly
                            value={generatedLink}
                            className="flex-1 bg-navy border border-soft-gold/10 rounded-lg px-2.5 py-2 text-base md:text-[10px] font-mono text-soft-gold select-all"
                          />
                          <button
                            onClick={handleCopyLink}
                            className={`px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all ${
                              linkCopied ? 'bg-emerald-950/40 text-emerald-300' : 'bg-white/5 border border-soft-gold/20 hover:bg-white/10'
                            }`}
                          >
                            {linkCopied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          linkType === 'personalized'
                            ? `Dear ${guestNameInput.trim()},\n\nWe warmly invite you to celebrate the wedding union of ${tempConfig.couple.groom} & ${tempConfig.couple.bride} on ${tempConfig.dates.mainDateEn}.\n\nPlease view our wedding invitation details and RSVP at the link below:\n${generatedLink}\n\nWe look forward to your presence and prayers!`
                            : `As Salaam Alaikum,\n\nWe warmly invite you to celebrate the wedding union of ${tempConfig.couple.groom} & ${tempConfig.couple.bride} on ${tempConfig.dates.mainDateEn}.\n\nPlease view our wedding invitation details and RSVP at the link below:\n${generatedLink}\n\nWe look forward to your presence and prayers!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                      >
                        Share on WhatsApp
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

                       {activeTab === 'analytics' && (
              <div className="bg-white/5 border border-soft-gold/15 p-5 rounded-2xl shadow-xl space-y-6">
                <div>
                  <h3 className="font-playfair text-lg text-soft-gold mb-1">Invitation Traffic Analytics</h3>
                  <p className="font-lora text-[11px] text-ivory/50 italic">Live tracking of guests who have opened the invitation link.</p>
                </div>

                {visitsList.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-ivory/40 font-lora text-sm">No visits recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-soft-gold/20 text-soft-gold text-xs uppercase tracking-wider font-inter">
                          <th className="pb-3 pr-4 font-semibold">Guest Name</th>
                          <th className="pb-3 px-4 font-semibold">Location</th>
                          <th className="pb-3 px-4 font-semibold">Date & Time</th>
                          <th className="pb-3 pl-4 font-semibold hidden md:table-cell">Device</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-lora text-ivory/80">
                        {visitsList.map((visit, idx) => (
                          <tr key={visit.id || idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 pr-4">
                              <span className="font-medium text-ivory block">{visit.guest_name}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-ivory/70">{visit.city}, {visit.country}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-[11px] text-ivory/50">
                                {new Date(visit.created_at || '').toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 pl-4 hidden md:table-cell text-[10px] text-ivory/40">
                              <div className="truncate max-w-[200px]" title={visit.device_info}>
                                {visit.device_info}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </section>
        </div>


      </div>
    </div>
  )
}
export default AdminDashboard
