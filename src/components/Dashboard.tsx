import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Activity,
  Heart,
  Brain
} from "lucide-react";

export function Dashboard() {
  // Mock data for charts
  const moodData = [
    { date: 'Mon', mood: 6 },
    { date: 'Tue', mood: 4 },
    { date: 'Wed', mood: 7 },
    { date: 'Thu', mood: 5 },
    { date: 'Fri', mood: 8 },
    { date: 'Sat', mood: 6 },
    { date: 'Sun', mood: 7 }
  ];

  const issueData = [
    { name: 'Anxiety', value: 35, color: '#C8B6FF' },
    { name: 'Depression', value: 28, color: '#FFB6C1' },
    { name: 'Stress', value: 20, color: '#A8E6CF' },
    { name: 'Relationships', value: 12, color: '#BDE0FE' },
    { name: 'Other', value: 5, color: '#E6E6FA' }
  ];

  const stats = [
    {
      title: 'Active Users',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Chat Sessions',
      value: '3,891',
      change: '+8%',
      icon: MessageSquare,
      color: 'from-blue-500 to-teal-500'
    },
    {
      title: 'Crisis Interventions',
      value: '23',
      change: '-15%',
      isAlert: true,
      icon: AlertTriangle,
      color: 'from-pink-500 to-orange-500'
    },
    {
      title: 'Avg. Mood Score',
      value: '6.4',
      change: '+5%',
      icon: Activity,
      color: 'from-teal-500 to-blue-500'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'crisis',
      message: 'User mentioned self-harm keywords',
      time: '2 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'mood',
      message: 'User mood consistently low for 5 days',
      time: '1 hour ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'engagement',
      message: 'User missed 3 scheduled check-ins',
      time: '3 hours ago',
      severity: 'low'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Insights into user wellness and platform health</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="rounded-3xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <Badge 
                          variant={stat.isAlert ? "destructive" : "secondary"}
                          className={`text-xs rounded-full ${
                            stat.isAlert 
                              ? 'bg-red-900/50 text-red-300' 
                              : 'bg-green-900/50 text-green-300'
                          }`}
                        >
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} p-3`}>
                      <stat.icon className="w-full h-full text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Trends */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="rounded-3xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-pink-400" />
                  Weekly Mood Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[1, 10]}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="url(#moodGradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#C8B6FF', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#FFB6C1' }}
                    />
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#C8B6FF" />
                        <stop offset="100%" stopColor="#FFB6C1" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Issue Categories */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="rounded-3xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  Issue Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={issueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                    >
                      {issueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {issueData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="rounded-3xl bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-pink-400" />
                  Recent Alerts
                </div>
                <Button variant="outline" size="sm" className="rounded-2xl">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        alert.severity === 'high' ? 'bg-red-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                      className="rounded-full"
                    >
                      {alert.severity}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
