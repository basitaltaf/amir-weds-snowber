import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface RSVPData {
  id?: string;
  created_at?: string;
  guest_name: string;
  phone: string;
  num_guests: number;
  attending: boolean;
  message: string;
}

export interface GuestbookEntry {
  id?: string;
  created_at?: string;
  name: string;
  message: string;
}

export interface WeddingConfig {
  couple: {
    groom: string;
    bride: string;
  };
  dates: {
    mainDateEn: string;
    mainDateUr: string;
    countdownTarget: string;
  };
  hero: {
    subtitleEn: string;
    subtitleUr: string;
  };
  family: {
    groomSide: string[];
    brideSide: string[];
  };
  events: {
    hinabandi: {
      dateEn: string;
      dateUr: string;
      time: string;
      items: Array<{ time: string; activity: string }>;
    };
    masnandnishni: {
      dateEn: string;
      dateUr: string;
      time: string;
      items: Array<{ time: string; activity: string }>;
    };
    reception_baraat: {
      dateEn: string;
      dateUr: string;
      time: string;
      items: Array<{ time: string; activity: string }>;
    };
  };
  venue: {
    titleEn: string;
    titleUr: string;
    poemLinesEn: string[];
    poemLinesUr: string[];
    lat: number;
    lng: number;
    directionsUrl: string;
  };
  music: {
    musicUrl: string;
    autoPlay: boolean;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  announcements: Array<{
    id: string;
    text: string;
    active: boolean;
  }>;
  gallery: Array<{
    src: string;
    alt: string;
  }>;
  portraits: {
    groom: string;
    bride: string;
  };
  memorial?: {
    enabled: boolean;
    titleEn: string;
    messageEn: string;
    duaEn: string;
    members: string[];
  };
  emergencyContacts?: Array<{
    name: string;
    phone: string;
  }>;
}

export const DEFAULT_CONFIG: WeddingConfig = {
  couple: {
    groom: 'Amir',
    bride: 'Snowber'
  },
  dates: {
    mainDateEn: 'September 23 & 24, 2026',
    mainDateUr: '۲۳ اور ۲۴ ستمبر ۲۰۲۶',
    countdownTarget: '2026-09-23T17:00:00'
  },
  hero: {
    subtitleEn: 'We Are Getting Married',
    subtitleUr: 'ہم رشتہ ازدواج میں منسلک ہو رہے ہیں'
  },
  family: {
    groomSide: [
      'Son of : Mr. & Mrs. Mohammad Altaf Mir',
      'Brother of : Arwa Altaf & Basit Altaf'
    ],
    brideSide: [
      'Daughter of : Mr. & Mrs. Mohammad Mustafa Mir'
    ]
  },
  events: {
    hinabandi: {
      dateEn: 'Wednesday, September 23, 2026',
      dateUr: 'بدھ، ۲۳ ستمبر ۲۰۲۶',
      time: '7:00 PM (approx)',
      items: [
        { time: '05:00 PM', activity: 'Guest Arrival & Welcome Drinks' },
        { time: '06:00 PM', activity: 'Hinabandi Ceremony' },
        { time: '08:30 PM', activity: 'Feast Dinner' }
      ]
    },
    masnandnishni: {
      dateEn: 'Thursday, September 24, 2026',
      dateUr: 'جمعرات، ۲۴ ستمبر ۲۰۲۶',
      time: '12:00 PM',
      items: [
        { time: '01:30 PM', activity: 'Guest Arrival & Welcome Refreshments' },
        { time: '02:00 PM', activity: 'Masnand Nishin Ceremony' },
        { time: '02:45 PM', activity: 'Wedding Luncheon' }
      ]
    },
    reception_baraat: {
      dateEn: 'Thursday, September 24, 2026',
      dateUr: 'جمعرات، ۲۴ ستمبر ۲۰۲۶',
      time: '6:00 PM (approx)',
      items: [
        { time: '07:30 PM', activity: 'Baraat Departure' },
        { time: '08:30 PM', activity: 'Nikah Ceremony' },
        { time: '09:30 PM', activity: 'Wedding Dinner' }
      ]
    }
  },
  venue: {
    titleEn: 'Our Residence',
    titleUr: 'ہمارا مسکن (رہائش گاہ)',
    poemLinesEn: [
      'With the blessings of Allah,',
      'we warmly invite you to our home',
      'to celebrate the wedding of',
      'Amir & Snowber',
      'Your presence and prayers',
      'will make our celebration complete.'
    ],
    poemLinesUr: [
      'اللہ تعالیٰ کے فضل و کرم سے،',
      'ہم آپ کو اپنے گھر آنے کی گرمجوشی سے دعوت دیتے ہیں',
      'تاکہ عامر اور صنوبر کی شادی کی خوشیوں میں شرکت کر سکیں',
      'عامر اور صنوبر',
      'آپ کی تشریف آوری اور دعائیں',
      'ہماری خوشیوں کو مکمل کریں گی۔'
    ],
    lat: 34.498396,
    lng: 74.377186,
    directionsUrl: 'https://maps.app.goo.gl/iqhyStgdMtokAgGq7'
  },
  music: {
    musicUrl: '/ishq.mp3',
    autoPlay: true
  },
  seo: {
    title: 'Wedding Invitation | Amir & Snowber',
    description: 'We warmly invite you to join us in celebrating the wedding union of Amir and Snowber on September 23 & 24, 2026.',
    ogImage: '/gallery_01.png'
  },
  announcements: [
    { id: '1', text: 'Welcome to our wedding! Please remember to RSVP by June 10, 2025.', active: true }
  ],
  gallery: [
    { src: '/gallery_01.png', alt: 'Wedding Couple' },
    { src: '/gallery_2.png', alt: 'Ceremony Decor' },
    { src: '/gallery_03.png', alt: 'Floral Arrangements' },
    { src: '/gallery_04.png', alt: 'Venue Details' }
  ],
  portraits: {
    groom: '/groom.png',
    bride: '/bride.png'
  },
  memorial: {
    enabled: true,
    titleEn: 'In Loving Memory',
    messageEn: 'Forever in our hearts, always in our thoughts. As we celebrate this new beginning, we remember and honor the beloved members of our family who are no longer with us but remain with us in spirit.',
    duaEn: 'May Allah (ﷻ) grant them the highest place in Jannatul Firdaus. Ameen.',
    members: [
      'Late Abdul Aziz Mir (Grandfather Of Groom)',
      'Late Shahmala Begum (Grandmother Of Groom)',
      'Late Shameema Begum (Mother Of Groom)'
    ]
  },
  emergencyContacts: [
    { name: 'Basit Altaf', phone: '+91 91499 12345' },
    { name: 'Arwa Altaf', phone: '+91 91499 54321' }
  ]
}

const LOCAL_STORAGE_RSVP_KEY = 'wedding_invitation_rsvps'
const LOCAL_STORAGE_GUESTBOOK_KEY = 'wedding_invitation_guestbook'
const LOCAL_STORAGE_SETTINGS_KEY = 'wedding_invitation_settings'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const rsvpApi = {
  submit: async (data: RSVPData): Promise<{ success: boolean; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('rsvp').insert([data])
      if (error) {
        console.error('Supabase RSVP insert error:', error)
        return { success: false, error }
      }
      return { success: true }
    } else {
      console.warn('Supabase not configured. Saving RSVP to LocalStorage fallback.')
      await delay(800)
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RSVP_KEY) || '[]')
      existing.push({ ...data, id: Math.random().toString(), created_at: new Date().toISOString() })
      localStorage.setItem(LOCAL_STORAGE_RSVP_KEY, JSON.stringify(existing))
      return { success: true }
    }
  },

  fetchAll: async (): Promise<{ success: boolean; data?: RSVPData[]; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Supabase RSVP fetch error:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } else {
      await delay(400)
      const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RSVP_KEY) || '[]')
      return { success: true, data }
    }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('rsvp').delete().eq('id', id)
      if (error) {
        console.error('Supabase RSVP delete error:', error)
        return { success: false, error }
      }
      return { success: true }
    } else {
      await delay(300)
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RSVP_KEY) || '[]')
      const filtered = existing.filter((item: any) => item.id !== id)
      localStorage.setItem(LOCAL_STORAGE_RSVP_KEY, JSON.stringify(filtered))
      return { success: true }
    }
  }
}

export const guestbookApi = {
  submit: async (entry: { name: string; message: string }): Promise<{ success: boolean; data?: GuestbookEntry; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('guestbook').insert([entry]).select().single()
      if (error) {
        console.error('Supabase guestbook insert error:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } else {
      console.warn('Supabase not configured. Saving guestbook entry to LocalStorage fallback.')
      await delay(600)
      const newEntry: GuestbookEntry = {
        id: Math.random().toString(),
        created_at: new Date().toISOString(),
        ...entry
      }
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GUESTBOOK_KEY) || '[]')
      existing.unshift(newEntry)
      localStorage.setItem(LOCAL_STORAGE_GUESTBOOK_KEY, JSON.stringify(existing))
      return { success: true, data: newEntry }
    }
  },
  
  fetchAll: async (): Promise<{ success: boolean; data?: GuestbookEntry[]; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Supabase guestbook fetch error:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } else {
      console.warn('Supabase not configured. Fetching guestbook entries from LocalStorage fallback.')
      await delay(400)
      const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GUESTBOOK_KEY) || '[]')
      
      if (data.length === 0) {
        const defaultBlessings: GuestbookEntry[] = [
          {
            id: '1',
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            name: 'Sarah & Tariq',
            message: 'Wishing you both a lifetime of happiness, love, and laughter! May your bond grow stronger with each passing day. Mubarak!'
          },
          {
            id: '2',
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            name: 'Uncle Majid',
            message: 'Heartiest congratulations to Amir and Snowber! Looking forward to celebrating this beautiful union. May Allah bless you both.'
          }
        ]
        localStorage.setItem(LOCAL_STORAGE_GUESTBOOK_KEY, JSON.stringify(defaultBlessings))
        return { success: true, data: defaultBlessings }
      }
      return { success: true, data }
    }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('guestbook').delete().eq('id', id)
      if (error) {
        console.error('Supabase guestbook delete error:', error)
        return { success: false, error }
      }
      return { success: true }
    } else {
      await delay(300)
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GUESTBOOK_KEY) || '[]')
      const filtered = existing.filter((item: any) => item.id !== id)
      localStorage.setItem(LOCAL_STORAGE_GUESTBOOK_KEY, JSON.stringify(filtered))
      return { success: true }
    }
  }
}

export const settingsApi = {
  fetch: async (): Promise<{ success: boolean; data?: WeddingConfig; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('config')
          .limit(1)
          .maybeSingle()
        if (error) {
          console.error('Supabase settings fetch error:', error)
          return { success: false, error }
        }
        if (!data) {
          await settingsApi.save(DEFAULT_CONFIG)
          return { success: true, data: DEFAULT_CONFIG }
        }
        const parsed = data.config as WeddingConfig
        let updated = false
        if (!parsed.dates || parsed.dates.mainDateEn === 'October 1 & 2, 2026') {
          parsed.dates = DEFAULT_CONFIG.dates
          parsed.events = DEFAULT_CONFIG.events
          if (parsed.seo) {
            parsed.seo.description = DEFAULT_CONFIG.seo.description
          }
          updated = true
        }
        if (parsed.gallery && parsed.gallery.some(g => g.src.includes('_17833') || g.src.includes('media__') || g.src.includes('couple_1'))) {
          parsed.gallery = DEFAULT_CONFIG.gallery
          parsed.portraits = DEFAULT_CONFIG.portraits
          updated = true
        }
        if (!parsed.memorial) {
          parsed.memorial = DEFAULT_CONFIG.memorial
          updated = true
        } else if (parsed.memorial.members) {
          const hasDetails = parsed.memorial.members.some(m => m.includes('Of Groom'))
          if (!hasDetails) {
            parsed.memorial.members = DEFAULT_CONFIG.memorial!.members
            updated = true
          }
        }
        if (!parsed.emergencyContacts) {
          parsed.emergencyContacts = DEFAULT_CONFIG.emergencyContacts
          updated = true
        }
        if (updated) {
          await settingsApi.save(parsed)
        }
        return { success: true, data: parsed }
      } catch (err: any) {
        return { success: false, error: err }
      }
    } else {
      const local = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY)
      if (!local) {
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_CONFIG))
        return { success: true, data: DEFAULT_CONFIG }
      }
      const parsed = JSON.parse(local) as WeddingConfig
      let updated = false
      if (!parsed.dates || parsed.dates.mainDateEn === 'October 1 & 2, 2026') {
        parsed.dates = DEFAULT_CONFIG.dates
        parsed.events = DEFAULT_CONFIG.events
        if (parsed.seo) {
          parsed.seo.description = DEFAULT_CONFIG.seo.description
        }
        updated = true
      }
      // Automatically sanitize paths that reference old temporary artifacts to avoid broken images
      if (parsed.gallery && parsed.gallery.some(g => g.src.includes('_17833') || g.src.includes('media__') || g.src.includes('couple_1'))) {
        parsed.gallery = DEFAULT_CONFIG.gallery
        parsed.portraits = DEFAULT_CONFIG.portraits
        updated = true
      }
      if (!parsed.memorial) {
        parsed.memorial = DEFAULT_CONFIG.memorial
        updated = true
      } else if (parsed.memorial.members) {
        const hasDetails = parsed.memorial.members.some(m => m.includes('Of Groom'))
        if (!hasDetails) {
          parsed.memorial.members = DEFAULT_CONFIG.memorial!.members
          updated = true
        }
      }
      if (!parsed.emergencyContacts) {
        parsed.emergencyContacts = DEFAULT_CONFIG.emergencyContacts
        updated = true
      }
      if (updated) {
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(parsed))
      }
      return { success: true, data: parsed }
    }
  },

  save: async (config: WeddingConfig): Promise<{ success: boolean; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: fetchErr } = await supabase.from('settings').select('id').limit(1).maybeSingle()
        if (fetchErr) return { success: false, error: fetchErr }
        
        let res;
        if (data) {
          res = await supabase.from('settings').update({ config }).eq('id', data.id)
        } else {
          res = await supabase.from('settings').insert([{ config }])
        }
        
        if (res.error) {
          console.error('Supabase settings save error:', res.error)
          return { success: false, error: res.error }
        }
        return { success: true }
      } catch (err: any) {
        return { success: false, error: err }
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(config))
      return { success: true }
    }
  }
}

export interface GuestUpload {
  id?: string;
  created_at?: string;
  guest_name: string;
  image_url: string; // Base64 data-url or remote URL
  caption?: string;
  isPrivate?: boolean;
}

const LOCAL_STORAGE_GUEST_UPLOADS_KEY = 'wedding_guest_uploads'

export const guestUploadsApi = {
  create: async (entry: Omit<GuestUpload, 'id' | 'created_at'>): Promise<{ success: boolean; data?: GuestUpload; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('guest_uploads')
        .insert([entry])
        .select()
        .single()
      if (error) {
        console.error('Supabase guest_uploads create error:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } else {
      await delay(500)
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GUEST_UPLOADS_KEY) || '[]')
      const newEntry: GuestUpload = {
        ...entry,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      }
      existing.push(newEntry)
      localStorage.setItem(LOCAL_STORAGE_GUEST_UPLOADS_KEY, JSON.stringify(existing))
      return { success: true, data: newEntry }
    }
  },

  list: async (): Promise<{ success: boolean; data?: GuestUpload[]; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('guest_uploads')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Supabase guest_uploads list error:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } else {
      await delay(400)
      const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GUEST_UPLOADS_KEY) || '[]')
      if (data.length === 0) {
        const defaultUploads: GuestUpload[] = [
          {
            id: 'u1',
            created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
            guest_name: 'Zahra Khan',
            image_url: '/gallery_2.png',
            caption: 'Beautiful decor!'
          },
          {
            id: 'u2',
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            guest_name: 'Imran Altaf',
            image_url: '/gallery_3.png',
            caption: 'Felt so royal!'
          }
        ]
        localStorage.setItem(LOCAL_STORAGE_GUEST_UPLOADS_KEY, JSON.stringify(defaultUploads))
        return { success: true, data: defaultUploads }
      }
      return { success: true, data }
    }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('guest_uploads').delete().eq('id', id)
      if (error) {
        console.error('Supabase guest_uploads delete error:', error)
        return { success: false, error }
      }
      return { success: true }
    } else {
      await delay(300)
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_GUEST_UPLOADS_KEY) || '[]')
      const filtered = existing.filter((item: any) => item.id !== id)
      localStorage.setItem(LOCAL_STORAGE_GUEST_UPLOADS_KEY, JSON.stringify(filtered))
      return { success: true }
    }
  }
}

export interface Visit {
  id?: string;
  created_at?: string;
  guest_name: string;
  city: string;
  country: string;
  ip_address: string;
  device_info: string;
}

const LOCAL_STORAGE_VISITS_KEY = 'wedding_invitation_visits'

export const visitsApi = {
  record: async (visit: Omit<Visit, 'id' | 'created_at'>): Promise<{ success: boolean; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('visits').insert([visit])
      if (error) {
        console.error('Supabase visit insert error:', error)
        return { success: false, error }
      }
      return { success: true }
    } else {
      const newVisit: Visit = {
        ...visit,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      }
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VISITS_KEY) || '[]')
      existing.unshift(newVisit)
      localStorage.setItem(LOCAL_STORAGE_VISITS_KEY, JSON.stringify(existing))
      return { success: true }
    }
  },

  fetchAll: async (): Promise<{ success: boolean; data?: Visit[]; error?: any }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Supabase visits fetch error:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } else {
      await delay(400)
      const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VISITS_KEY) || '[]')
      return { success: true, data }
    }
  }
}
