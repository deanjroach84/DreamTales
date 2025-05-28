interface AnimalOption {
  value: string;
  label: string;
  emoji: string;
  hoverColor: string;
}

const animals: AnimalOption[] = [
  { value: "lion", label: "Lion", emoji: "🦁", hoverColor: "hover:border-yellow-400" },
  { value: "elephant", label: "Elephant", emoji: "🐘", hoverColor: "hover:border-gray-400" },
  { value: "rabbit", label: "Rabbit", emoji: "🐰", hoverColor: "hover:border-pink-400" },
  { value: "bear", label: "Bear", emoji: "🧸", hoverColor: "hover:border-amber-600" },
  { value: "owl", label: "Owl", emoji: "🦉", hoverColor: "hover:border-purple-400" },
  { value: "fox", label: "Fox", emoji: "🦊", hoverColor: "hover:border-orange-400" },
  { value: "giraffe", label: "Giraffe", emoji: "🦒", hoverColor: "hover:border-yellow-500" },
  { value: "penguin", label: "Penguin", emoji: "🐧", hoverColor: "hover:border-blue-400" },
];

interface AnimalSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AnimalSelector({ value, onChange, disabled }: AnimalSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {animals.map((animal) => (
        <label
          key={animal.value}
          className={`
            block cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 text-center group
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${value === animal.value 
              ? 'border-lavender bg-lavender/10' 
              : `border-gentle-gray ${animal.hoverColor}`
            }
          `}
        >
          <input
            type="radio"
            name="animal"
            value={animal.value}
            checked={value === animal.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
            disabled={disabled}
          />
          <div className="text-4xl mb-2">{animal.emoji}</div>
          <span className={`text-sm font-medium transition-colors ${
            value === animal.value 
              ? 'text-purple-700' 
              : 'text-gray-700 group-hover:text-purple-600'
          }`}>
            {animal.label}
          </span>
        </label>
      ))}
    </div>
  );
}
