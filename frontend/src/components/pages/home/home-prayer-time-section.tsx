const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

const degrees =
  (hours % 12) * 30 + (minutes / 60) * 30 + (seconds / 60 / 60) * 30;

const style = {
  background: `conic-gradient(#7c3aed ${degrees}deg, #fff 0deg)`,
};

const prayers = [
  { title: "fajr", time: "12:30" },
  { title: "dhuhr", time: "12:30" },
  { title: "asr", time: "12:30" },
  { title: "magherb", time: "12:30" },
  { title: "isha", time: "12:30" },
  { title: "tahajud", time: "12:30" },
  { title: "sunrise", time: "12:30" },
  { title: "sunset", time: "12:30" },
];

export default function HomePrayerTimeSection() {
  return (
    <section className="flex items-center gap-4">
      <div className="w-full h-72 bg-muted rounded-lg grid grid-cols-4 grid-rows-2 gap-4 p-4">
        {prayers.map(({ title, time }) => (
          <div
            key={title}
            className="bg-card rounded-sm flex flex-col items-start pl-4 justify-center"
          >
            <span className="capitalize text-lg">{title}</span>
            <span className="text-4xl">{time}</span>
          </div>
        ))}
      </div>
      <div className="min-w-72 h-72 bg-muted rounded-lg flex items-center justify-center">
        <div
          style={style}
          className=" relative rounded-[100%] bg-white size-56 flex items-center justify-center"
        >
          <div className="rounded-[100%] bg-muted size-[13.3rem] flex flex-col items-center justify-center">
            <span>Asr Prayer After</span>
            <span className="text-3xl">1h 12min</span>
          </div>

          {/* <span className="absolute text-xs text-white -right-3 bg-violet-600 size-8 rounded-full flex items-center justify-center">
            Fajr
          </span> */}
        </div>
      </div>
    </section>
  );
}
