import { useState } from 'react';
import { api } from '../lib/api';
import { Send, Mail, User, Globe, Building2, MapPin } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { t } from '../lib/translations';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Am. Samoa','Andorra','Angola','Antarctica',
  'Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas',
  'Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin',
  'Bermuda','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil',
  'British Virgin Islands','Brunei','Bulgaria','Burkina Faso','Burundi',
  'Cambodia','Cameroon','Canada','Cape Verde','Cayman Islands',
  'Central African Republic','Chile','China','Christmas Island','Colombia',
  'Comoros','Congo','Cook Islands','Costa Rica',"Cote D'Ivoire",'Croatia',
  'Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica',
  'Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea',
  'Eritrea','Estonia','Ethiopia','Falkland Islands','Fiji','Finland','France',
  'French Guiana','French Polynesia','Gabon','Gambia','Georgia','Germany',
  'Ghana','Greece','Greenland','Grenada','Guadeloupe','Guam','Guatemala',
  'Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Italy','Jamaica',
  'Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kitts and Nevis','Kuwait',
  'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya',
  'Liechtenstein','Lithuania','Luxembourg','Macau','Macedonia','Madagascar',
  'Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands',
  'Martinique','Mauritania','Mauritius','Mayotte','Mexico','Micronesia',
  'Moldova','Mongolia','Montserrat','Morocco','Mozambique','Myanmar',
  'Namibia','Nauru','Nepal','Netherlands','Netherlands Antilles',
  'New Caledonia','New Zealand','Nicaragua','Niger','Nigeria','Niue',
  'North Korea','Northern Mariana Islands','Norway','Oman','Pakistan',
  'Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru',
  'Philippines','Pitcairn Island','Poland','Portugal','Puerto Rico','Qatar',
  'Reunion','Romania','Russia','Rwanda','S. Georgia and the S. Sandwich Is.',
  'Saint Lucia','Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines','Samoa-American','Samoa-Western',
  'San Marino','Sao Tome and Principe','Saudi Arabia','Seychelles',
  'Singapore','Slovakia','Slovenia','Solomon Islands','Somalia',
  'South Africa','South Korea','Spain','Sri Lanka',
  'Svalbard and Jan Mayen Islands','Sweden','Switzerland','Syria',
  'Syrian Arab Republic','Taiwan','Tajikistan','Tanzania','Thailand','Togo',
  'Tokelau','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan',
  'Turks and Caicos Islands','Tuvalu','Uganda','United Arab Emirates',
  'United Kingdom','United States','United States Minor Outlying Islands',
  'Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam',
  'Virgin Islands','Wallis and Futuna','Western Sahara','Yemen','Yugoslavia',
  'Zambia','Zimbabwe',
];

interface FeedbackForm {
  subject: string;
  name: string;
  organization: string;
  country: string;
  email: string;
  message: string;
}

const EMPTY_FORM: FeedbackForm = {
  subject: '',
  name: '',
  organization: '',
  country: 'United Arab Emirates',
  email: '',
  message: '',
};

export default function Feedback() {
  const { lang, isRtl } = useLanguage();
  const [form, setForm] = useState<FeedbackForm>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus('idle');
    try {
      await api.post('/feedback', form);
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  const field = (key: keyof FeedbackForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#009900]/30 focus:border-[#009900] transition-colors text-gray-800 placeholder-gray-400';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-[#009900] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            {t(lang, 'feedback.title', 'Feedback')}
          </h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            {t(lang, 'feedback.subtitle', 'Your voice matters. Help us improve the portal or reach out with your questions.')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* ── Form card ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
              <h2
                className="text-2xl font-bold text-[#009900] mb-8"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {t(lang, 'feedback.formTitle', 'Feedback')}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {/* Row 1: Subject (full width) */}
                <div>
                  <label className={labelClass}>
                    {t(lang, 'feedback.subjectLabel', 'Subject')}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={t(lang, 'feedback.subjectPlaceholder', 'Enter subject')}
                    value={form.subject}
                    onChange={(e) => field('subject', e.target.value)}
                  />
                </div>

                {/* Row 2: Name | Organization */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      {t(lang, 'feedback.nameLabel', 'Name')}
                    </label>
                    <div className="relative">
                      <User
                        className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                      />
                      <input
                        type="text"
                        className={`${inputClass} ps-12`}
                        placeholder={t(lang, 'feedback.namePlaceholder', 'Your full name')}
                        value={form.name}
                        onChange={(e) => field('name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      {t(lang, 'feedback.orgLabel', 'Organization/Authority')}
                    </label>
                    <div className="relative">
                      <Building2
                        className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                      />
                      <input
                        type="text"
                        className={`${inputClass} ps-12`}
                        placeholder={t(lang, 'feedback.orgPlaceholder', 'Your organization or authority')}
                        value={form.organization}
                        onChange={(e) => field('organization', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Country | Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      {t(lang, 'feedback.countryLabel', 'Country')}
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                      />
                      <select
                        className={`${inputClass} ps-12 appearance-none`}
                        value={form.country}
                        onChange={(e) => field('country', e.target.value)}
                      >
                        <option value="">
                          {t(lang, 'feedback.countrySelect', 'Select')}
                        </option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      {t(lang, 'feedback.emailLabel', 'Email')}
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                      />
                      <input
                        type="email"
                        className={`${inputClass} ps-12`}
                        placeholder={t(lang, 'feedback.emailPlaceholder', 'your@email.com')}
                        value={form.email}
                        onChange={(e) => field('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Message (full width) */}
                <div>
                  <label className={labelClass}>
                    {t(lang, 'feedback.contentLabel', 'Message')}
                  </label>
                  <textarea
                    rows={8}
                    className={`${inputClass} resize-none`}
                    placeholder={t(lang, 'feedback.messagePlaceholder', 'How can we help you today?')}
                    value={form.message}
                    onChange={(e) => field('message', e.target.value)}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#009900] hover:bg-[#006600] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {sending ? (
                    t(lang, 'feedback.sending', 'Sending...')
                  ) : (
                    <>
                      <Send size={18} />
                      {t(lang, 'feedback.sendBtn', 'Send')}
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium">
                    {t(lang, 'feedback.success', 'Thank you! Your message has been sent successfully.')}
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium">
                    {t(lang, 'feedback.error', 'Sorry, something went wrong. Please try again later.')}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* ── Contact sidebar ───────────────────────────────────────── */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <h3
                className="text-xl font-bold text-[#009900] mb-6"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {t(lang, 'feedback.contactTitle', 'Contact Info')}
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      {t(lang, 'feedback.emailLabel', 'Email Us')}
                    </p>
                    <p className="text-gray-700 font-medium">info@uasa.ae</p>
                  </div>
                </div>
                <div className="flex gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      {t(lang, 'feedback.websiteLabel', 'Website')}
                    </p>
                    <p className="text-gray-700 font-medium">www.uasa.ae</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
