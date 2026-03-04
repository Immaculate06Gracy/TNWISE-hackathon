import { 
  Cpu, 
  Lightbulb, 
  Target, 
  Users, 
  Zap, 
  Award,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <div className="p-6 lg:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8 pb-12 border-b border-white/10">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
          Smart Backup Power & <br/><span className="text-primary">Electrical Safety System</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
          An automated load-shedding solution for rural clinics to ensure uninterrupted power for critical life-saving equipment during grid failures.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Badge variant="outline" className="bg-white/5 border-white/10 px-4 py-1.5 text-sm font-mono">
            <Award className="w-4 h-4 mr-2 text-warning" />
            TNWISE Hackathon 2026
          </Badge>
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-4 py-1.5 text-sm font-mono">
            Hardware Integration
          </Badge>
        </div>
      </div>

      {/* The Problem & Solution */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <Target className="w-24 h-24 text-destructive" />
          </div>
          <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center mb-6 border border-destructive/30">
            <Lightbulb className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-4">The Problem</h3>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Rural healthcare facilities suffer from frequent and prolonged power outages. When the grid fails, backup inverters are often rapidly drained by non-essential loads (like administrative AC units or general lighting), leaving critical life-saving equipment (oxygen concentrators, neonatal warmers, emergency surgical lights) without power when it matters most.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <Cpu className="w-24 h-24 text-success" />
          </div>
          <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-6 border border-success/30">
            <Zap className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-4">Our Solution</h3>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We implemented a <strong>Smart SPDT (Single Pole Double Throw) Relay System</strong>. It actively monitors main grid supply. Upon failure, it automatically isolates the 'Non-Critical Load' bus and routes all remaining battery inverter power exclusively to the 'Critical Load' bus, extending the operational time of essential medical devices significantly.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="glass-card rounded-3xl p-8 md:p-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold text-white">Team Innovate4Health</h3>
            <p className="text-muted-foreground flex items-center gap-2 mt-1 font-mono text-sm">
              <BookOpen className="w-4 h-4" /> SRM Madurai College For Engineering and Technology
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {["Immaculate Gracy R", "Jagadha R", "Seetha Devi M"].map((member, i) => (
            <div key={i} className="bg-background/50 border border-white/5 rounded-2xl p-6 hover:bg-white/[0.02] transition-colors border-l-2 border-l-primary hover:border-l-4">
              <h4 className="text-lg font-bold text-white mb-1">{member}</h4>
              <p className="text-sm font-mono text-primary/80">Project Member</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
