import { Link } from 'react-router-dom';
import { Target, Globe2, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FinancialInclusion() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-[#009900]/10 rounded-full blur-3xl -me-64 -mt-64" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-bold mb-8 leading-tight">
              Driving Financial Inclusion in the Arab World
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              Advancing accessible, sustainable, and responsible financial services for all segments of society across UASA member states.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              title: "Strategies & Projects",
              icon: Target,
              desc: "Regional initiatives aimed at broadening financial access and digital transformation.",
              link: "/inclusion/projects"
            },
            {
              title: "Global Policy Areas",
              icon: Globe2,
              desc: "Aligning Arab markets with G20 and OECD financial inclusion standards.",
              link: "/inclusion/policies"
            },
            {
              title: "Benchmarking Index",
              icon: BarChart3,
              desc: "Monitoring progress through the UASA Financial Inclusion Index.",
              link: "/inclusion/index"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group">
              <div className="w-14 h-14 bg-green-50 text-[#009900] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#009900] group-hover:text-white transition-all duration-300">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">{item.desc}</p>
              <Link to={item.link} className="flex items-center gap-2 text-sm font-bold text-[#009900] hover:text-amber-600 transition-colors">
                View Details <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-24 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-amber-400 rounded-3xl rotate-3" />
            <img 
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000" 
              alt="Digital Finance" 
              className="relative rounded-3xl shadow-2xl w-full object-cover aspect-video"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
              Bridging the Gap Through Innovation
            </h2>
            <div className="space-y-6">
              {[
                "Promoting financial literacy for youth and women",
                "Supporting FinTech startups and digital payment systems",
                "Establishing consumer protection frameworks",
                "Regional benchmarking and data-driven policy making"
              ].map((text, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-slate-600 font-medium">{text}</p>
                </div>
              ))}
            </div>
            <button className="mt-10 bg-[#009900] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#006600] transition-all">
              Download Regional Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

