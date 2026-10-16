import React, { useState } from 'react';
import {
  Layout,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  Megaphone,
  Check,
  X,
  Upload
} from 'lucide-react';
import { useAdminData } from '../../../context/AdminDataContext';

export default function ContentManagementTab() {
  const {
    websiteContent,
    updateBusinessInfo,
    updateAboutContent,
    updateAnnouncement,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    addAddon,
    updateAddon,
    deleteAddon,
    toggleAddonStatus,
    addFaq,
    updateFaq,
    deleteFaq
  } = useAdminData();

  const [activeSubTab, setActiveSubTab] = useState('banners'); // 'banners' | 'promo' | 'about' | 'services' | 'contact' | 'faqs'
  const [saveToast, setSaveToast] = useState('');

  const triggerToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Editing state for banner modal
  const [editingBanner, setEditingBanner] = useState(null);
  const [isNewBanner, setIsNewBanner] = useState(false);

  // Editing state for service modal
  const [editingService, setEditingService] = useState(null);
  const [isNewService, setIsNewService] = useState(false);

  // Editing state for addon modal
  const [editingAddon, setEditingAddon] = useState(null);
  const [isNewAddon, setIsNewAddon] = useState(false);

  // Editing state for FAQ modal
  const [editingFaq, setEditingFaq] = useState(null);
  const [isNewFaq, setIsNewFaq] = useState(false);

  // Contact / Business Info Form State
  const [businessForm, setBusinessForm] = useState({ ...websiteContent.businessInfo });

  // About Page Form State
  const [aboutForm, setAboutForm] = useState({ ...websiteContent.about });

  // Promo Banner State
  const [promoForm, setPromoForm] = useState({ ...websiteContent.announcement });

  const handleSaveBusinessInfo = (e) => {
    e.preventDefault();
    updateBusinessInfo(businessForm);
    triggerToast('Business & Contact Info updated and live on website!');
  };

  const handleSaveAbout = (e) => {
    e.preventDefault();
    updateAboutContent(aboutForm);
    triggerToast('About Us Page updated and live on website!');
  };

  const handleSavePromo = (e) => {
    e.preventDefault();
    updateAnnouncement(promoForm);
    triggerToast('Promotional section updated and live on website!');
  };

  const handleBannerImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file is large (>5MB). Please select an image under 5MB.');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingBanner(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image file is large (>2MB). Please select an image under 2MB.');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingService(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddonImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image file is large (>2MB). Please select an image under 2MB.');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingAddon(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-slideDown">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Website Content Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Edit text, hero banners, promotional sections, services, and contact info. All changes reflect instantly on the public website.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-600" />
          <span>Preview Public Website</span>
        </a>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'banners', label: 'Home Hero Banners' },
          { id: 'promo', label: 'Promotional Section' },
          { id: 'about', label: 'About Us Page' },
          { id: 'services', label: 'Services & Detailing' },
          { id: 'addons', label: 'Optional Add-ons' },
          { id: 'contact', label: 'Contact & Business Info' },
          { id: 'faqs', label: 'FAQs & Help' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. HERO BANNERS MANAGEMENT */}
      {activeSubTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Home Page Hero Banners</h3>
              <p className="text-xs text-slate-500">Carousel banners displayed on the homepage</p>
            </div>
            <button
              onClick={() => {
                setIsNewBanner(true);
                setEditingBanner({
                  image: '/images/banner-1.png',
                  badge: 'Doorstep Care',
                  titleLine1: 'Clean Cars Daily.',
                  titleLine2: 'Zero Water Mess.',
                  subtitle: 'Doorstep car cleaning for apartment owners across Hyderabad.',
                  primaryCtaText: 'Explore Plans',
                  primaryCtaLink: '/plans',
                  secondaryCtaText: 'Book Now',
                  published: true
                });
              }}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {websiteContent.banners.map((b, idx) => (
              <div
                key={b.id || idx}
                className={`bg-white rounded-2xl border p-4 shadow-xs transition-all ${
                  b.published ? 'border-slate-200' : 'border-slate-300 opacity-60 bg-slate-50'
                }`}
              >
                <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-slate-800">
                  <img
                    src={b.image}
                    alt={b.titleLine1}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-cyan-500/30">
                    {b.badge}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => {
                        toggleBannerStatus(b.id);
                        triggerToast(`Banner ${b.published ? 'unpublished' : 'published'}!`);
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                        b.published ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {b.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{b.published ? 'Published' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{b.titleLine1} {b.titleLine2}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{b.subtitle}</p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                    <span>CTA: {b.primaryCtaText} ({b.primaryCtaLink})</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsNewBanner(false);
                      setEditingBanner({ ...b });
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-cyan-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  {websiteContent.banners.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm('Delete this hero banner?')) {
                          deleteBanner(b.id);
                          triggerToast('Banner deleted!');
                        }
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PROMOTIONAL SECTION */}
      {activeSubTab === 'promo' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-3xl space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Promotional Announcement Bar & Banners</h3>
            <p className="text-xs text-slate-500">Configure special discount banners and apartment promotional alerts</p>
          </div>

          <form onSubmit={handleSavePromo} className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="promoEnabled"
                checked={promoForm.enabled}
                onChange={(e) => setPromoForm({ ...promoForm, enabled: e.target.checked })}
                className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
              />
              <label htmlFor="promoEnabled" className="text-xs font-semibold text-slate-800 cursor-pointer">
                Display Promotional Announcement Bar on Website
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Badge Text</label>
              <input
                type="text"
                value={promoForm.badge}
                onChange={(e) => setPromoForm({ ...promoForm, badge: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="e.g. Special Offer or Monsoon Discount"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Announcement Message</label>
              <textarea
                rows={3}
                value={promoForm.text}
                onChange={(e) => setPromoForm({ ...promoForm, text: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="Announcement banner text..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Discount Code</label>
                <input
                  type="text"
                  value={promoForm.discountCode}
                  onChange={(e) => setPromoForm({ ...promoForm, discountCode: e.target.value })}
                  className="w-full p-2.5 text-xs font-mono font-bold text-cyan-700 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="CLEANZX2026"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Button / Link Destination</label>
                <input
                  type="text"
                  value={promoForm.linkUrl}
                  onChange={(e) => setPromoForm({ ...promoForm, linkUrl: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="/plans"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-cyan-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Publish Announcement</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. ABOUT US PAGE */}
      {activeSubTab === 'about' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-4xl space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">About Us Page Content</h3>
            <p className="text-xs text-slate-500">Update story, mission, and company values</p>
          </div>

          <form onSubmit={handleSaveAbout} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Headline</label>
              <input
                type="text"
                value={aboutForm.headline}
                onChange={(e) => setAboutForm({ ...aboutForm, headline: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subheadline</label>
              <textarea
                rows={2}
                value={aboutForm.subheadline}
                onChange={(e) => setAboutForm({ ...aboutForm, subheadline: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Story Paragraph 1</label>
                <textarea
                  rows={4}
                  value={aboutForm.story1}
                  onChange={(e) => setAboutForm({ ...aboutForm, story1: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Story Paragraph 2</label>
                <textarea
                  rows={4}
                  value={aboutForm.story2}
                  onChange={(e) => setAboutForm({ ...aboutForm, story2: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mission Title</label>
                <input
                  type="text"
                  value={aboutForm.missionTitle}
                  onChange={(e) => setAboutForm({ ...aboutForm, missionTitle: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mission Description</label>
                <input
                  type="text"
                  value={aboutForm.missionDescription}
                  onChange={(e) => setAboutForm({ ...aboutForm, missionDescription: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-cyan-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save About Page Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. SERVICES & DETAILING */}
      {activeSubTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Standard Doorstep Services</h3>
              <p className="text-xs text-slate-500">Core morning car care included across plans</p>
            </div>
            <button
              onClick={() => {
                setIsNewService(true);
                setEditingService({
                  name: '',
                  tagline: '',
                  description: '',
                  details: ['Doorstep specialized care', 'Apartment safe method'],
                  image: '/images/hero-car.jpg',
                  published: true
                });
              }}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {websiteContent.services.map((srv, idx) => (
              <div
                key={srv.id || idx}
                className={`bg-white rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                  srv.published ? 'border-slate-200 hover:shadow-md' : 'border-slate-300 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  {/* Service Visual Image Header */}
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-900 border border-slate-200 group">
                    <img
                      src={srv.image || '/images/hero-car.jpg'}
                      alt={srv.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/hero-car.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-sm">
                        {srv.tagline || 'Doorstep Service'}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => {
                          toggleServiceStatus(srv.id);
                          triggerToast(`Service ${srv.published ? 'hidden' : 'published'}!`);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors ${
                          srv.published ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {srv.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{srv.published ? 'Active' : 'Unpublished'}</span>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2.5">
                      <span className="text-[11px] font-semibold text-white/90 drop-shadow-sm flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-cyan-300" />
                        <span className="truncate max-w-[220px]">{srv.image || '/images/hero-car.jpg'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{srv.name}</h4>
                      <p className="text-xs text-cyan-600 font-semibold">{srv.tagline}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.description}</p>

                  {srv.details && srv.details.length > 0 && (
                    <ul className="mt-3 space-y-1 text-[11px] text-slate-600 list-disc list-inside bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {srv.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsNewService(false);
                      setEditingService({ ...srv });
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-cyan-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Service & Image</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete service "${srv.name}"? This will remove it from the website.`)) {
                        deleteService(srv.id);
                        triggerToast('Service deleted!');
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. OPTIONAL ADD-ONS */}
      {activeSubTab === 'addons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Optional Add-On Services</h3>
              <p className="text-xs text-slate-500">Manage extra detailing add-ons and base pricing</p>
            </div>
            <button
              onClick={() => {
                setIsNewAddon(true);
                setEditingAddon({
                  name: '',
                  description: '',
                  price: 299,
                  badge: 'Popular',
                  image: '/images/addon-vacuum.jpg',
                  published: true
                });
              }}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Add-on</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {websiteContent.addons.map((a, idx) => (
              <div
                key={a.id || idx}
                className={`bg-white rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
                  a.published ? 'border-slate-200 hover:shadow-md' : 'border-slate-300 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  {/* Add-on Visual Image Header */}
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-slate-900 border border-slate-200 group">
                    <img
                      src={a.image || '/images/addon-vacuum.jpg'}
                      alt={a.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/addon-vacuum.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-cyan-300 border border-cyan-500/30 shadow-sm">
                        {a.badge || 'Add-on'}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => {
                          toggleAddonStatus(a.id);
                          triggerToast(`Add-on ${a.published ? 'hidden' : 'active'}!`);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors ${
                          a.published ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {a.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{a.published ? 'Active' : 'Hidden'}</span>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2.5">
                      <span className="text-[11px] font-semibold text-white/90 drop-shadow-sm flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-cyan-300" />
                        <span className="truncate max-w-[160px]">{a.image || '/images/addon-vacuum.jpg'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{a.name}</h4>
                    <span className="text-sm font-black text-cyan-600 shrink-0">₹{a.price || 299}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{a.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsNewAddon(false);
                      setEditingAddon({ ...a });
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-cyan-600 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit & Image</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete add-on "${a.name}"?`)) {
                        deleteAddon(a.id);
                        triggerToast('Add-on deleted!');
                      }
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CONTACT & BUSINESS INFO */}
      {activeSubTab === 'contact' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-4xl space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Contact & Business Information</h3>
            <p className="text-xs text-slate-500">Phone numbers, operating hours, and location displayed in Navbar, Footer, and Contact page</p>
          </div>

          <form onSubmit={handleSaveBusinessInfo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={businessForm.name}
                  onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tagline</label>
                <input
                  type="text"
                  value={businessForm.tagline}
                  onChange={(e) => setBusinessForm({ ...businessForm, tagline: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Official Phone Number</label>
                <input
                  type="text"
                  value={businessForm.phone}
                  onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp Business Number</label>
                <input
                  type="text"
                  value={businessForm.whatsapp}
                  onChange={(e) => setBusinessForm({ ...businessForm, whatsapp: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={businessForm.email}
                  onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Operating Hours Start</label>
                <input
                  type="text"
                  value={businessForm.operatingHours?.start || '06:00 AM'}
                  onChange={(e) => setBusinessForm({
                    ...businessForm,
                    operatingHours: { ...businessForm.operatingHours, start: e.target.value }
                  })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Operating Hours End</label>
                <input
                  type="text"
                  value={businessForm.operatingHours?.end || '11:30 AM'}
                  onChange={(e) => setBusinessForm({
                    ...businessForm,
                    operatingHours: { ...businessForm.operatingHours, end: e.target.value }
                  })}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Location / Coverage Area Text</label>
              <input
                type="text"
                value={businessForm.location?.displayText || 'Mehdipatnam, Hyderabad, Telangana, India'}
                onChange={(e) => setBusinessForm({
                  ...businessForm,
                  location: { ...businessForm.location, displayText: e.target.value }
                })}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-cyan-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Contact Information</span>
            </button>
          </form>
        </div>
      )}

      {/* 7. FAQS */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500">Manage FAQs displayed across Home, Contact, and Plans pages</p>
            </div>
            <button
              onClick={() => {
                setIsNewFaq(true);
                setEditingFaq({
                  question: '',
                  answer: '',
                  published: true
                });
              }}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {websiteContent.faqs.map((faq, idx) => (
              <div key={faq.id || idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">Q: {faq.question}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">A: {faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setIsNewFaq(false);
                        setEditingFaq({ ...faq });
                      }}
                      className="p-1.5 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this FAQ item?')) {
                          deleteFaq(faq.id);
                          triggerToast('FAQ deleted!');
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BANNER EDIT MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {isNewBanner ? 'Add New Hero Banner' : 'Edit Hero Banner'}
              </h3>
              <button
                onClick={() => setEditingBanner(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs max-h-[75vh] overflow-y-auto">
              {/* Banner Visual Image Selection */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Banner Visual Image</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Live Homepage Hero Background</span>
                </div>

                {/* Live Preview Container */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner group">
                  <img
                    src={editingBanner.image || '/images/banner-1.png'}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/banner-1.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="truncate max-w-[260px] opacity-90 drop-shadow font-mono text-[10px]">
                      {editingBanner.image?.startsWith('data:') ? 'Custom uploaded image file' : (editingBanner.image || '/images/banner-1.png')}
                    </span>
                    <span className="bg-cyan-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-xs">
                      Live Preview
                    </span>
                  </div>
                </div>

                {/* Primary Action: Select / Upload File from Computer */}
                <div>
                  <label className="w-full min-h-[42px] px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-600/20 transition-all text-xs">
                    <Upload className="w-4 h-4" />
                    <span>Choose / Select Image from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerImageUpload}
                    />
                  </label>
                </div>

                {/* Quick Presets */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 mb-1.5">Or Choose from Ready Presets:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Banner 1 (Car Care)', url: '/images/banner-1.png' },
                      { label: 'Banner 2 (Detailing)', url: '/images/banner-2.jpg' },
                      { label: 'Banner 3 (Doorstep)', url: '/images/banner-3.jpg' },
                      { label: 'Hero Car (Exterior)', url: '/images/hero-car.jpg' }
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setEditingBanner(prev => ({ ...prev, image: preset.url }))}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                          editingBanner.image === preset.url
                            ? 'bg-cyan-600 text-white font-bold shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Optional URL Input */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 font-semibold">Or paste image web link (optional):</span>
                  </div>
                  <input
                    type="text"
                    value={editingBanner.image || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    placeholder="e.g. /images/banner-1.png or web link"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={editingBanner.badge}
                  onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                  placeholder="e.g. Serving Overall Hyderabad"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Title Line 1</label>
                  <input
                    type="text"
                    value={editingBanner.titleLine1}
                    onChange={(e) => setEditingBanner({ ...editingBanner, titleLine1: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Title Line 2</label>
                  <input
                    type="text"
                    value={editingBanner.titleLine2}
                    onChange={(e) => setEditingBanner({ ...editingBanner, titleLine2: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={editingBanner.primaryCtaText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, primaryCtaText: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={editingBanner.primaryCtaLink}
                    onChange={(e) => setEditingBanner({ ...editingBanner, primaryCtaLink: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setEditingBanner(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isNewBanner) {
                    addBanner(editingBanner);
                    triggerToast('New banner added!');
                  } else {
                    updateBanner(editingBanner.id, editingBanner);
                    triggerToast('Banner updated!');
                  }
                  setEditingBanner(null);
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE EDIT MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  {isNewService ? 'Add New Service' : 'Edit Service & Image'}
                </h3>
                <p className="text-[11px] text-slate-400">Updates reflect live on website and plans</p>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Image Configuration Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Service Visual Image</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Card thumbnail & detail banner</span>
                </div>

                {/* Live Preview */}
                <div className="relative h-40 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 group">
                  <img
                    src={editingService.image || '/images/hero-car.jpg'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/hero-car.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="truncate max-w-[280px] opacity-90 drop-shadow">
                      {editingService.image || '/images/hero-car.jpg'}
                    </span>
                    <span className="bg-cyan-600/90 px-2 py-0.5 rounded text-[10px] font-bold">
                      Preview
                    </span>
                  </div>
                </div>

                {/* URL input and Upload Button */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={editingService.image || ''}
                      onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      placeholder="e.g. /images/hero-car.jpg or https://..."
                    />
                  </div>
                  <div>
                    <label className="w-full h-full min-h-[38px] px-3 py-2 bg-white hover:bg-cyan-50 hover:border-cyan-400 text-slate-700 hover:text-cyan-700 border border-slate-300 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all">
                      <Upload className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleServiceImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 mb-1.5">Quick Presets:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Dust Removal', url: '/images/hero-car.jpg' },
                      { label: 'Exterior Wash', url: '/images/exterior-wash.jpg' },
                      { label: 'Glass Clean', url: '/images/glass-cleaning.jpg' },
                      { label: 'Tyre Clean', url: '/images/tyre-detailing.jpg' },
                      { label: 'Polish & Detailing', url: '/images/banner-2.jpg' }
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setEditingService({ ...editingService, image: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                          editingService.image === preset.url
                            ? 'bg-cyan-600 text-white font-bold shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Service Name</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="e.g. Exterior Washing"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingService.tagline}
                  onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="e.g. Spotless doorstep exterior wash"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Service description..."
                />
              </div>

              {/* Bullet Features Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-600">Key Features / Inclusions</label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(prev => ({
                        ...prev,
                        details: [...(prev.details || []), 'Professional doorstep service inclusion']
                      }));
                    }}
                    className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Point</span>
                  </button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {(editingService.details || []).map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => {
                          const next = [...(editingService.details || [])];
                          next[dIdx] = e.target.value;
                          setEditingService(prev => ({ ...prev, details: next }));
                        }}
                        className="flex-1 p-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        placeholder="Inclusion item..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (editingService.details || []).filter((_, i) => i !== dIdx);
                          setEditingService(prev => ({ ...prev, details: next }));
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(!editingService.details || editingService.details.length === 0) && (
                    <p className="text-[11px] text-slate-400 italic py-1">No feature points added yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setEditingService(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isNewService) {
                    addService(editingService);
                    triggerToast('Service added!');
                  } else {
                    updateService(editingService.id, editingService);
                    triggerToast('Service updated!');
                  }
                  setEditingService(null);
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADDON EDIT MODAL */}
      {editingAddon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  {isNewAddon ? 'Add New Detailing Add-on' : 'Edit Add-on & Image'}
                </h3>
                <p className="text-[11px] text-slate-400">Updates reflect live on website and booking</p>
              </div>
              <button
                onClick={() => setEditingAddon(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Add-on Image Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Add-on Visual Image</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Thumbnail for customers</span>
                </div>

                {/* Live Preview */}
                <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 group">
                  <img
                    src={editingAddon.image || '/images/addon-vacuum.jpg'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/addon-vacuum.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="truncate max-w-[240px] opacity-90 drop-shadow">
                      {editingAddon.image || '/images/addon-vacuum.jpg'}
                    </span>
                    <span className="bg-cyan-600/90 px-2 py-0.5 rounded text-[10px] font-bold">
                      Preview
                    </span>
                  </div>
                </div>

                {/* URL and File Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={editingAddon.image || ''}
                      onChange={(e) => setEditingAddon({ ...editingAddon, image: e.target.value })}
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      placeholder="e.g. /images/addon-vacuum.jpg"
                    />
                  </div>
                  <div>
                    <label className="w-full h-full min-h-[38px] px-3 py-2 bg-white hover:bg-cyan-50 hover:border-cyan-400 text-slate-700 hover:text-cyan-700 border border-slate-300 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all">
                      <Upload className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddonImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 mb-1.5">Quick Presets:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Vacuuming', url: '/images/addon-vacuum.jpg' },
                      { label: 'Dashboard', url: '/images/addon-dashboard.jpg' },
                      { label: 'Deep Clean', url: '/images/addon-deep-interior.jpg' },
                      { label: 'Tyre Polish', url: '/images/addon-tyre.jpg' },
                      { label: 'Seat Clean', url: '/images/addon-seat-cleaning.jpg' }
                    ].map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setEditingAddon({ ...editingAddon, image: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                          editingAddon.image === preset.url
                            ? 'bg-cyan-600 text-white font-bold shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Add-on Name</label>
                <input
                  type="text"
                  value={editingAddon.name}
                  onChange={(e) => setEditingAddon({ ...editingAddon, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="e.g. Interior Vacuuming"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingAddon.price}
                    onChange={(e) => setEditingAddon({ ...editingAddon, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingAddon.badge}
                    onChange={(e) => setEditingAddon({ ...editingAddon, badge: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    placeholder="e.g. Most Requested"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingAddon.description}
                  onChange={(e) => setEditingAddon({ ...editingAddon, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Describe this add-on..."
                />
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setEditingAddon(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isNewAddon) {
                    addAddon(editingAddon);
                    triggerToast('Add-on created!');
                  } else {
                    updateAddon(editingAddon.id, editingAddon);
                    triggerToast('Add-on updated!');
                  }
                  setEditingAddon(null);
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save Add-on
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ EDIT MODAL */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">{isNewFaq ? 'Add New FAQ' : 'Edit FAQ'}</h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Question</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setEditingFaq(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isNewFaq) {
                    addFaq(editingFaq);
                    triggerToast('FAQ added!');
                  } else {
                    updateFaq(editingFaq.id, editingFaq);
                    triggerToast('FAQ updated!');
                  }
                  setEditingFaq(null);
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
