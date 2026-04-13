import { useEffect, useState } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Loader,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Card, Badge } from "../../UI";

export default function WeatherTab() {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWeather({
        condition: "partly_cloudy",
        temp: 28,
        humidity: 65,
        uvIndex: 7,
        windSpeed: 12,
        peakSunHours: "10:00 AM - 3:00 PM",
        forecast: "Clear skies expected for optimal solar generation",
        alert: null,
        performanceImpact: "optimal",
        solarEfficiency: 92,
      });
      setLoadingWeather(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  function getWeatherIcon(size = "w-12 h-12") {
    if (!weather) return <Cloud className={size} />;

    switch (weather.condition) {
      case "sunny":
        return <Sun className={`${size} text-yellow-500`} />;
      case "rainy":
        return <CloudRain className={`${size} text-blue-500`} />;
      case "partly_cloudy":
        return <Cloud className={`${size} text-slate-400`} />;
      default:
        return <Cloud className={size} />;
    }
  }

  if (loadingWeather) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-sky-200/70 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-sm dark:border-sky-900/30 dark:from-sky-900/20 dark:via-slate-900 dark:to-cyan-900/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              Solar Weather
            </div>

            <h3 className="mt-3 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              <Cloud className="h-6 w-6 text-sky-500" />
              Weather & Performance Impact
            </h3>

            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Track daily weather conditions and how they affect solar production efficiency.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-[28px] border border-sky-200/70 bg-gradient-to-br from-sky-50 to-cyan-50 p-6 dark:border-sky-900/30 dark:from-sky-900/20 dark:to-cyan-900/10 lg:col-span-2">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon()}
              <div>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white">
                  {weather?.temp}°C
                </h4>
                <p className="text-sm capitalize text-slate-600 dark:text-slate-400">
                  {weather?.condition.replace("_", " ")}
                </p>
              </div>
            </div>

            <Badge className="self-start rounded-full px-4 py-2 text-sm font-semibold sm:self-auto">
              {weather?.solarEfficiency}% Efficiency
            </Badge>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <WeatherMiniCard label="Humidity" value={`${weather?.humidity}%`} />
            <WeatherMiniCard label="UV Index" value={`${weather?.uvIndex}/10`} />
            <WeatherMiniCard label="Wind Speed" value={`${weather?.windSpeed} km/h`} />
            <WeatherMiniCard
              label="Condition"
              value={weather?.performanceImpact}
              valueClassName="capitalize text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-3 flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              <h5 className="font-bold text-slate-900 dark:text-white">Peak Sun Hours</h5>
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {weather?.peakSunHours}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {weather?.forecast}
            </p>
          </div>

          {weather?.alert && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-yellow-300 bg-yellow-100 p-4 dark:border-yellow-700 dark:bg-yellow-900/30">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-300">
                  Weather Alert
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  {weather.alert}
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="rounded-[28px] border border-slate-200/70 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h4 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            System Performance
          </h4>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Solar Efficiency
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {weather?.solarEfficiency}%
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  style={{ width: `${weather?.solarEfficiency}%` }}
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <h5 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Today’s Insights
              </h5>

              <div className="space-y-3">
                <InsightRow
                  icon={CheckCircle}
                  iconClassName="text-emerald-500"
                  text="Optimal sunlight conditions detected"
                />
                <InsightRow
                  icon={CheckCircle}
                  iconClassName="text-emerald-500"
                  text="Expected output: 95–100% capacity"
                />
                <InsightRow
                  icon={Wind}
                  iconClassName="text-sky-500"
                  text="Light wind is helping panel cooling"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <h5 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                7-Day Forecast
              </h5>

              <div className="space-y-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{day}</span>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {85 + Math.floor(Math.random() * 15)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-[26px] border border-slate-200/70 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Sun className="h-5 w-5 text-yellow-500" />
            Best Usage Windows
          </h4>

          <div className="space-y-4">
            <UsageRow time="Morning (6am-12pm)" level="Good" levelClassName="text-sky-600 dark:text-sky-400" />
            <UsageRow time="Afternoon (12pm-6pm)" level="Peak" levelClassName="text-emerald-600 dark:text-emerald-400" />
            <UsageRow time="Evening (6pm-12am)" level="Moderate" levelClassName="text-slate-900 dark:text-slate-100" />
          </div>
        </Card>

        <Card className="rounded-[26px] border border-slate-200/70 p-6 dark:border-slate-800 dark:bg-slate-900">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <AlertCircle className="h-5 w-5 text-sky-500" />
            Recommendations
          </h4>

          <div className="space-y-3">
            <InsightRow
              icon={CheckCircle}
              iconClassName="text-emerald-500"
              text="Great day for solar. System running at optimal capacity."
            />
            <InsightRow
              icon={CheckCircle}
              iconClassName="text-emerald-500"
              text="Consider running high-energy appliances during peak hours."
            />
            <InsightRow
              icon={AlertCircle}
              iconClassName="text-sky-500"
              text="Clear skies expected all week with excellent production forecast."
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function WeatherMiniCard({ label, value, valueClassName = "" }) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/80">
      <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`text-lg font-bold text-slate-900 dark:text-white ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

function InsightRow({ icon: Icon, iconClassName, text }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClassName}`} />
      <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  );
}

function UsageRow({ time, level, levelClassName }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <span className="text-sm text-slate-600 dark:text-slate-400">{time}</span>
      <span className={`font-semibold ${levelClassName}`}>{level}</span>
    </div>
  );
}