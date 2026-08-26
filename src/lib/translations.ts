export type Language = 'en' | 'ur';

export interface TranslationSet {
  dir: 'ltr' | 'rtl';
  heart: string;
  weddingInvitation: string;
  groomAndBride: string;
  parentsTitle: string;
  weddingEvents: string;
  countdownTitle: string;
  galleryTitle: string;
  rsvpTitle: string;
  guestbookTitle: string;
  footerThankYou: string;
  
  // Landing Page
  invitationCoverGreeting: string;
  openInvitationBtn: string;
  
  // Hero
  heroGreeting: string;
  weddingDateLabel: string;
  weddingDateValue: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  
  // Parents Section
  brideParentsHeader: string;
  groomParentsHeader: string;
  brideParents: string[];
  groomParents: string[];
  familyDividerText: string;

  // Events
  hinabandi: string;
  masnandnishni: string;
  reception_baraat: string;
  viewMap: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  
  eventsData: {
    hinabandi: { title: string; date: string; time: string; venue: string; mapUrl: string };
    masnandnishni: { title: string; date: string; time: string; venue: string; mapUrl: string };
    reception_baraat: { title: string; date: string; time: string; venue: string; mapUrl: string };
  };

  // Venue Section Custom Invite Note
  venueResidenceTitle: string;
  venueInviteLine1: string;
  venueInviteLine2: string;
  venueInviteLine3: string;
  venueInviteLine4: string;
  venueInviteLine5: string;
  venueInviteLine6: string;

  // RSVP Form
  rsvpSubtitle: string;
  guestNameLabel: string;
  phoneLabel: string;
  numGuestsLabel: string;
  willAttendLabel: string;
  attendingYes: string;
  attendingNo: string;
  messageLabel: string;
  submitRsvpBtn: string;
  submitting: string;
  rsvpSuccess: string;
  rsvpError: string;

  // Guestbook
  guestbookSubtitle: string;
  guestbookNameLabel: string;
  guestbookMessageLabel: string;
  guestbookMessagePlaceholder: string;
  sendBlessingBtn: string;
  blessingSuccess: string;
  noBlessingsYet: string;

  // Audio / Music
  musicPlaying: string;
  musicMuted: string;

  // Share / Footer
  shareInvitation: string;
  shareWhatsapp: string;
  copyLink: string;
  linkCopied: string;
  guestGreeting: string;
}

export const translations: Record<Language, TranslationSet> = {
  en: {
    dir: 'ltr',
    heart: '❤',
    weddingInvitation: 'Wedding Invitation',
    groomAndBride: 'Amir & Snowber',
    parentsTitle: 'The Families',
    weddingEvents: 'Wedding Events',
    countdownTitle: 'The Countdown',
    galleryTitle: 'Our Moments',
    rsvpTitle: 'RSVP',
    guestbookTitle: 'Guestbook',
    footerThankYou: 'Thank you for being a part of our journey and celebrating our love.',
    
    invitationCoverGreeting: 'Together with their families\nRequest the honor of your gracious presence\nWedding Invitation',
    openInvitationBtn: 'Open Invitation',
    
    heroGreeting: 'We Are Getting Married',
    weddingDateLabel: 'Save The Date',
    weddingDateValue: 'September 23 & 24, 2026',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    
    brideParentsHeader: "Bride's Family",
    groomParentsHeader: "Groom's Family",
    brideParents: ['Daughter of Mr. & Mrs. Mohammad Yaseen'],
    groomParents: ['Son of : Mr. & Mrs. Mohammad Altaf Mir', 'Brother of : Arwa Altaf & Basit Altaf'],
    familyDividerText: 'Family blessings',

    hinabandi: 'Hinabandi',
    masnandnishni: 'Masnandnishni',
    reception_baraat: 'Reception of Baraat',
    viewMap: 'View Location',
    eventDate: 'Date',
    eventTime: 'Time',
    eventVenue: 'Venue',
    
    eventsData: {
      hinabandi: {
        title: 'Hinabandi Ceremony',
        date: 'Wednesday, September 23, 2026',
        time: '7:00 PM (approx)',
        venue: 'Our Residence',
        mapUrl: 'https://maps.app.goo.gl/iqhyStgdMtokAgGq7'
      },
      masnandnishni: {
        title: 'Masnandnishni Ceremony',
        date: 'Thursday, September 24, 2026',
        time: '12:00 PM',
        venue: 'Our Residence',
        mapUrl: 'https://maps.app.goo.gl/iqhyStgdMtokAgGq7'
      },
      reception_baraat: {
        title: 'Reception of Baraat',
        date: 'Thursday, September 24, 2026',
        time: '6:00 PM (approx)',
        venue: 'Our Residence',
        mapUrl: 'https://maps.app.goo.gl/iqhyStgdMtokAgGq7'
      }
    },

    venueResidenceTitle: 'Our Residence',
    venueInviteLine1: 'With the blessings of Allah,',
    venueInviteLine2: 'we warmly invite you to our home',
    venueInviteLine3: 'to celebrate the wedding of',
    venueInviteLine4: 'Amir & Snowber',
    venueInviteLine5: 'Your presence and prayers',
    venueInviteLine6: 'will make our celebration complete.',

    rsvpSubtitle: 'Kindly respond by September 20, 2026 so we can prepare for your presence.',
    guestNameLabel: 'Your Name',
    phoneLabel: 'Phone Number',
    numGuestsLabel: 'Number of Guests',
    willAttendLabel: 'Will you attend?',
    attendingYes: 'Joyfully Attend',
    attendingNo: 'Regretfully Decline',
    messageLabel: 'Wishes / Comments',
    submitRsvpBtn: 'Submit RSVP',
    submitting: 'Submitting...',
    rsvpSuccess: 'Thank you! Your RSVP has been submitted successfully.',
    rsvpError: 'There was an error submitting your RSVP. Please try again.',

    guestbookSubtitle: 'Leave your prayers and blessings for the beautiful couple.',
    guestbookNameLabel: 'Name',
    guestbookMessageLabel: 'Your Blessing',
    guestbookMessagePlaceholder: 'May your lives together be filled with endless love and joy...',
    sendBlessingBtn: 'Post Blessing',
    blessingSuccess: 'Blessing posted! Thank you for your warm words.',
    noBlessingsYet: 'No blessings left yet. Be the first to write!',

    musicPlaying: 'Music Playing',
    musicMuted: 'Music Muted',

    shareInvitation: 'Share this invitation with loved ones',
    shareWhatsapp: 'Share on WhatsApp',
    copyLink: 'Copy Invitation Link',
    linkCopied: 'Link Copied to Clipboard!',
    guestGreeting: 'We are honored to invite you,'
  },
  ur: {
    dir: 'rtl',
    heart: '❤',
    weddingInvitation: 'دعوتِ نامہ',
    groomAndBride: 'عامر اور صنوبر',
    parentsTitle: 'خاندان',
    weddingEvents: 'تقریباتِ شادی',
    countdownTitle: 'شمارشِ معکوس',
    galleryTitle: 'ہمارے لمحات',
    rsvpTitle: 'شرکت کی اطلاع',
    guestbookTitle: 'مہمانوں کی کتاب',
    footerThankYou: 'ہماری خوشیوں کا حصہ بننے اور اپنی دعاؤں سے نوازنے کا بے حد شکریہ۔',
    
    invitationCoverGreeting: 'خاندانوں کے ساتھ مل کر\nآپ کی باوقار شرکت کے خواہاں ہیں\nدعوتِ شادی',
    openInvitationBtn: 'دعوت نامہ کھولیں',
    
    heroGreeting: 'ہم رشتہ ازدواج میں منسلک ہو رہے ہیں',
    weddingDateLabel: 'تاریخ یاد رکھیں',
    weddingDateValue: '۲۳ اور ۲۴ ستمبر ۲۰۲۶',
    days: 'دن',
    hours: 'گھنٹے',
    minutes: 'منٹ',
    seconds: 'سیکنڈ',
    
    brideParentsHeader: "دلہن کا خاندان",
    groomParentsHeader: "دولہا کا خاندان",
    brideParents: ['صاحبزادی جناب محمد یاسین صاحب اور بیگم'],
    groomParents: ['صاحبزادے جناب محمد الطاف میر صاحب اور بیگم', 'ارویٰ الطاف اور باسط الطاف کے بھائی'],
    familyDividerText: 'خاندانی دعائیں',

    hinabandi: 'حنا بندی',
    masnandnishni: 'مسند نشینی',
    reception_baraat: 'بارات کا استقبال',
    viewMap: 'مقام دیکھیں',
    eventDate: 'تاریخ',
    eventTime: 'وقت',
    eventVenue: 'مقام',
    
    eventsData: {
      hinabandi: {
        title: 'حنا بندی کی تقریب',
        date: 'بدھ، ۲۳ ستمبر ۲۰۲۶',
        time: '۷:۰۰ بجے شام (تقریباً)',
        venue: 'ہمارا مسکن (رہائش گاہ)',
        mapUrl: 'https://maps.app.goo.gl/iqhyStgdMtokAgGq7'
      },
      masnandnishni: {
        title: 'مسند نشینی کی تقریب',
        date: 'جمعرات، ۲۴ ستمبر ۲۰۲۶',
        time: '۱۲:۰۰ بجے دوپہر',
        venue: 'ہمارا مسکن (رہائش گاہ)',
        mapUrl: 'https://maps.app.goo.gl/iqhyStgdMtokAgGq7'
      },
      reception_baraat: {
        title: 'بارات کا استقبال',
        date: 'جمعرات، ۲۴ ستمبر ۲۰۲۶',
        time: '۶:۰۰ بجے شام (تقریباً)',
        venue: 'ہمارا مسکن (رہائش گاہ)',
        mapUrl: 'https://maps.app.goo.gl/iqhyStgdMtokAgGq7'
      }
    },

    venueResidenceTitle: 'ہمارا مسکن (رہائش گاہ)',
    venueInviteLine1: 'اللہ تعالیٰ کے فضل و کرم سے،',
    venueInviteLine2: 'ہم آپ کو اپنے گھر آنے کی گرمجوشی سے دعوت دیتے ہیں',
    venueInviteLine3: 'تاکہ عامر اور صنوبر کی شادی کی خوشیوں میں شرکت کر سکیں',
    venueInviteLine4: 'عامر اور صنوبر',
    venueInviteLine5: 'آپ کی تشریف آوری اور دعائیں',
    venueInviteLine6: 'ہماری خوشیوں کو مکمل کریں گی۔',

    rsvpSubtitle: 'براہ کرم ۱۰ جون ۲۰۲۵ تک شرکت کی اطلاع دیں تاکہ ہم انتظامات مکمل کر سکیں۔',
    guestNameLabel: 'آپ کا نام',
    phoneLabel: 'فون نمبر',
    numGuestsLabel: 'مہمانوں کی تعداد',
    willAttendLabel: 'کیا آپ شرکت فرمائیں گے؟',
    attendingYes: 'خوشی سے شرکت فرمائیں گے',
    attendingNo: 'معذرت خواہ ہیں',
    messageLabel: 'دعائیہ کلمات / پیغام',
    submitRsvpBtn: 'شرکت کی اطلاع بھیجیں',
    submitting: 'بھیجا جا رہا ہے...',
    rsvpSuccess: 'شکریہ! آپ کی شرکت کی اطلاع کامیابی سے موصول ہو گئی ہے۔',
    rsvpError: 'شرکت کی اطلاع بھیجنے میں مسئلہ ہوا۔ دوبارہ کوشش کریں۔',

    guestbookSubtitle: 'نئے جوڑے کے لیے اپنے دعائیہ کلمات اور پیغامات تحریر کریں۔',
    guestbookNameLabel: 'نام',
    guestbookMessageLabel: 'آپ کی دعا',
    guestbookMessagePlaceholder: 'اللہ تعالیٰ آپ دونوں کو خوشیوں اور لازوال محبت سے نوازے...',
    sendBlessingBtn: 'پیغام پوسٹ کریں',
    blessingSuccess: 'پیغام پوسٹ ہو گیا۔ نیک تمناؤں کا شکریہ۔',
    noBlessingsYet: 'ابھی تک کوئی پیغام نہیں چھوڑا گیا۔ پہلے بنیں!',

    musicPlaying: 'موسیقی آن',
    musicMuted: 'موسیقی بند',

    shareInvitation: 'دعوت نامہ پیاروں کے ساتھ شیئر کریں',
    shareWhatsapp: 'واٹس ایپ پر شیئر کریں',
    copyLink: 'دعوت نامہ لنک کاپی کریں',
    linkCopied: 'لنک کاپی ہو گیا!',
    guestGreeting: 'ہمیں آپ کو مدعو کرنے کا اعزاز حاصل ہے،'
  }
};
