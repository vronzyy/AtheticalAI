// Comprehensive workout plans and exercises database

export const WORKOUT_PLANS = {
  gain: [
    {
      id: 'push_pull_legs',
      name: 'Push/Pull/Legs',
      description: 'Classic 6-day split for maximum muscle growth',
      frequency: '6 days/week',
      level: 'intermediate',
      days: [
        { day: 'Monday', focus: 'Push (Chest, Shoulders, Triceps)', type: 'strength' },
        { day: 'Tuesday', focus: 'Pull (Back, Biceps)', type: 'strength' },
        { day: 'Wednesday', focus: 'Legs & Core', type: 'strength' },
        { day: 'Thursday', focus: 'Push (Chest, Shoulders, Triceps)', type: 'strength' },
        { day: 'Friday', focus: 'Pull (Back, Biceps)', type: 'strength' },
        { day: 'Saturday', focus: 'Legs & Core', type: 'strength' },
        { day: 'Sunday', focus: 'Rest & Recovery', type: 'rest' },
      ]
    },
    {
      id: 'upper_lower',
      name: 'Upper/Lower Split',
      description: 'Perfect for building strength and size',
      frequency: '4 days/week',
      level: 'beginner',
      days: [
        { day: 'Monday', focus: 'Upper Body', type: 'strength' },
        { day: 'Tuesday', focus: 'Lower Body', type: 'strength' },
        { day: 'Wednesday', focus: 'Rest or Light Cardio', type: 'rest' },
        { day: 'Thursday', focus: 'Upper Body', type: 'strength' },
        { day: 'Friday', focus: 'Lower Body', type: 'strength' },
        { day: 'Saturday', focus: 'Sport Practice', type: 'sport_practice' },
        { day: 'Sunday', focus: 'Rest', type: 'rest' },
      ]
    },
    {
      id: 'full_body',
      name: 'Full Body Power',
      description: 'Build total body strength 3x per week',
      frequency: '3 days/week',
      level: 'beginner',
      days: [
        { day: 'Monday', focus: 'Full Body Strength A', type: 'strength' },
        { day: 'Tuesday', focus: 'Sport Practice', type: 'sport_practice' },
        { day: 'Wednesday', focus: 'Full Body Strength B', type: 'strength' },
        { day: 'Thursday', focus: 'Sport Practice', type: 'sport_practice' },
        { day: 'Friday', focus: 'Full Body Strength C', type: 'strength' },
        { day: 'Saturday', focus: 'Active Recovery', type: 'flexibility' },
        { day: 'Sunday', focus: 'Rest', type: 'rest' },
      ]
    },
    {
      id: 'bro_split',
      name: 'Classic Bodybuilding',
      description: 'One muscle group per day for maximum volume',
      frequency: '5 days/week',
      level: 'advanced',
      days: [
        { day: 'Monday', focus: 'Chest', type: 'strength' },
        { day: 'Tuesday', focus: 'Back', type: 'strength' },
        { day: 'Wednesday', focus: 'Shoulders', type: 'strength' },
        { day: 'Thursday', focus: 'Legs', type: 'strength' },
        { day: 'Friday', focus: 'Arms (Biceps & Triceps)', type: 'strength' },
        { day: 'Saturday', focus: 'Sport Practice', type: 'sport_practice' },
        { day: 'Sunday', focus: 'Rest', type: 'rest' },
      ]
    },
    {
      id: 'strength_hypertrophy',
      name: 'Power Building',
      description: 'Combine strength and size training',
      frequency: '5 days/week',
      level: 'intermediate',
      days: [
        { day: 'Monday', focus: 'Heavy Compound Lifts', type: 'strength' },
        { day: 'Tuesday', focus: 'Upper Body Hypertrophy', type: 'strength' },
        { day: 'Wednesday', focus: 'Rest or Mobility', type: 'flexibility' },
        { day: 'Thursday', focus: 'Heavy Lower Body', type: 'strength' },
        { day: 'Friday', focus: 'Lower Body Hypertrophy', type: 'strength' },
        { day: 'Saturday', focus: 'Sport Practice', type: 'sport_practice' },
        { day: 'Sunday', focus: 'Rest', type: 'rest' },
      ]
    },
  ],
  lose: [
    {
      id: 'hiit_strength',
      name: 'HIIT & Strength',
      description: 'Burn fat while maintaining muscle',
      frequency: '5 days/week',
      level: 'intermediate',
      days: [
        { day: 'Monday', focus: 'Upper Body Strength + HIIT', type: 'strength' },
        { day: 'Tuesday', focus: 'HIIT Cardio', type: 'hiit' },
        { day: 'Wednesday', focus: 'Lower Body Strength', type: 'strength' },
        { day: 'Thursday', focus: 'HIIT Cardio + Core', type: 'hiit' },
        { day: 'Friday', focus: 'Full Body Circuit', type: 'strength' },
        { day: 'Saturday', focus: 'Sport Practice', type: 'sport_practice' },
        { day: 'Sunday', focus: 'Active Recovery', type: 'flexibility' },
      ]
    },
    {
      id: 'metabolic',
      name: 'Metabolic Conditioning',
      description: 'High-intensity fat burning program',
      frequency: '6 days/week',
      level: 'advanced',
      days: [
        { day: 'Monday', focus: 'Metabolic Circuit A', type: 'hiit' },
        { day: 'Tuesday', focus: 'Strength + Cardio', type: 'strength' },
        { day: 'Wednesday', focus: 'Metabolic Circuit B', type: 'hiit' },
        { day: 'Thursday', focus: 'Strength + Cardio', type: 'strength' },
        { day: 'Friday', focus: 'Metabolic Circuit C', type: 'hiit' },
        { day: 'Saturday', focus: 'Sport Practice', type: 'sport_practice' },
        { day: 'Sunday', focus: 'Rest', type: 'rest' },
      ]
    },
    {
      id: 'cardio_strength',
      name: 'Cardio & Strength',
      description: 'Balanced approach to cutting weight',
      frequency: '5 days/week',
      level: 'beginner',
      days: [
        { day: 'Monday', focus: 'Full Body Strength', type: 'strength' },
        { day: 'Tuesday', focus: 'Steady State Cardio', type: 'cardio' },
        { day: 'Wednesday', focus: 'Full Body Strength', type: 'strength' },
        { day: 'Thursday', focus: 'Interval Training', type: 'hiit' },
        { day: 'Friday', focus: 'Full Body Strength', type: 'strength' },
        { day: 'Saturday', focus: 'Long Cardio Session', type: 'cardio' },
        { day: 'Sunday', focus: 'Rest', type: 'rest' },
      ]
    },
    {
      id: 'lean_athlete',
      name: 'Lean Athlete',
      description: 'Sport-focused fat loss program',
      frequency: '6 days/week',
      level: 'intermediate',
      days: [
        { day: 'Monday', focus: 'Agility & Conditioning', type: 'hiit' },
        { day: 'Tuesday', focus: 'Strength Training', type: 'strength' },
        { day: 'Wednesday', focus: 'Sport-Specific Drills', type: 'sport_practice' },
        { day: 'Thursday', focus: 'HIIT + Core', type: 'hiit' },
        { day: 'Friday', focus: 'Strength Training', type: 'strength' },
        { day: 'Saturday', focus: 'Game/Competition Prep', type: 'sport_practice' },
        { day: 'Sunday', focus: 'Active Recovery', type: 'flexibility' },
      ]
    },
  ]
};

export const SUGGESTED_WORKOUTS = {
  strength: [
    {
      name: 'Push Day - Chest & Shoulders',
      duration: 60,
      calories: 350,
      exercises: [
        { name: 'Bench Press', sets: '4x8-10', rest: '90 sec' },
        { name: 'Incline Dumbbell Press', sets: '3x10-12', rest: '60 sec' },
        { name: 'Overhead Press', sets: '4x8-10', rest: '90 sec' },
        { name: 'Lateral Raises', sets: '3x12-15', rest: '45 sec' },
        { name: 'Tricep Dips', sets: '3x10-12', rest: '60 sec' },
        { name: 'Cable Flyes', sets: '3x12-15', rest: '45 sec' },
      ]
    },
    {
      name: 'Pull Day - Back & Biceps',
      duration: 55,
      calories: 320,
      exercises: [
        { name: 'Deadlift', sets: '4x6-8', rest: '2 min' },
        { name: 'Pull-ups', sets: '4x8-10', rest: '90 sec' },
        { name: 'Barbell Rows', sets: '3x10-12', rest: '90 sec' },
        { name: 'Face Pulls', sets: '3x15-20', rest: '45 sec' },
        { name: 'Bicep Curls', sets: '3x10-12', rest: '60 sec' },
        { name: 'Hammer Curls', sets: '3x10-12', rest: '45 sec' },
      ]
    },
    {
      name: 'Leg Day - Quads & Hamstrings',
      duration: 65,
      calories: 400,
      exercises: [
        { name: 'Squats', sets: '4x8-10', rest: '2 min' },
        { name: 'Romanian Deadlifts', sets: '3x10-12', rest: '90 sec' },
        { name: 'Leg Press', sets: '3x12-15', rest: '90 sec' },
        { name: 'Walking Lunges', sets: '3x12 each', rest: '60 sec' },
        { name: 'Leg Curls', sets: '3x12-15', rest: '45 sec' },
        { name: 'Calf Raises', sets: '4x15-20', rest: '45 sec' },
      ]
    },
    {
      name: 'Upper Body Power',
      duration: 50,
      calories: 300,
      exercises: [
        { name: 'Push-ups', sets: '3x15-20', rest: '45 sec' },
        { name: 'Dumbbell Rows', sets: '3x10-12', rest: '60 sec' },
        { name: 'Shoulder Press', sets: '3x10-12', rest: '60 sec' },
        { name: 'Lat Pulldowns', sets: '3x12-15', rest: '60 sec' },
        { name: 'Tricep Pushdowns', sets: '3x12-15', rest: '45 sec' },
        { name: 'Bicep Curls', sets: '3x12-15', rest: '45 sec' },
      ]
    },
    {
      name: 'Lower Body Power',
      duration: 50,
      calories: 350,
      exercises: [
        { name: 'Goblet Squats', sets: '3x12-15', rest: '60 sec' },
        { name: 'Hip Thrusts', sets: '3x12-15', rest: '60 sec' },
        { name: 'Step-ups', sets: '3x10 each', rest: '45 sec' },
        { name: 'Leg Extensions', sets: '3x15-20', rest: '45 sec' },
        { name: 'Leg Curls', sets: '3x15-20', rest: '45 sec' },
        { name: 'Calf Raises', sets: '3x20', rest: '30 sec' },
      ]
    },
    {
      name: 'Full Body Strength',
      duration: 55,
      calories: 380,
      exercises: [
        { name: 'Squats', sets: '3x10', rest: '90 sec' },
        { name: 'Bench Press', sets: '3x10', rest: '90 sec' },
        { name: 'Barbell Rows', sets: '3x10', rest: '90 sec' },
        { name: 'Overhead Press', sets: '3x10', rest: '60 sec' },
        { name: 'Romanian Deadlifts', sets: '3x10', rest: '90 sec' },
        { name: 'Plank', sets: '3x45 sec', rest: '30 sec' },
      ]
    },
    {
      name: 'Chest & Triceps',
      duration: 45,
      calories: 280,
      exercises: [
        { name: 'Incline Bench Press', sets: '4x10', rest: '90 sec' },
        { name: 'Flat Dumbbell Press', sets: '3x12', rest: '60 sec' },
        { name: 'Cable Crossovers', sets: '3x15', rest: '45 sec' },
        { name: 'Close Grip Bench', sets: '3x10', rest: '60 sec' },
        { name: 'Skull Crushers', sets: '3x12', rest: '45 sec' },
        { name: 'Tricep Pushdowns', sets: '3x15', rest: '30 sec' },
      ]
    },
    {
      name: 'Back & Biceps',
      duration: 45,
      calories: 290,
      exercises: [
        { name: 'Lat Pulldowns', sets: '4x12', rest: '60 sec' },
        { name: 'Seated Cable Rows', sets: '3x12', rest: '60 sec' },
        { name: 'T-Bar Rows', sets: '3x10', rest: '90 sec' },
        { name: 'Reverse Flyes', sets: '3x15', rest: '45 sec' },
        { name: 'Barbell Curls', sets: '3x10', rest: '60 sec' },
        { name: 'Incline Dumbbell Curls', sets: '3x12', rest: '45 sec' },
      ]
    },
    {
      name: 'Shoulders & Core',
      duration: 40,
      calories: 250,
      exercises: [
        { name: 'Military Press', sets: '4x10', rest: '90 sec' },
        { name: 'Arnold Press', sets: '3x12', rest: '60 sec' },
        { name: 'Lateral Raises', sets: '4x15', rest: '45 sec' },
        { name: 'Front Raises', sets: '3x12', rest: '45 sec' },
        { name: 'Hanging Leg Raises', sets: '3x15', rest: '45 sec' },
        { name: 'Russian Twists', sets: '3x20', rest: '30 sec' },
      ]
    },
  ],
  cardio: [
    {
      name: 'Steady State Run',
      duration: 30,
      calories: 300,
      exercises: [
        { name: 'Warm-up Walk', sets: '5 min', rest: '-' },
        { name: 'Jog at moderate pace', sets: '20 min', rest: '-' },
        { name: 'Cool-down Walk', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Endurance Run',
      duration: 45,
      calories: 450,
      exercises: [
        { name: 'Warm-up Walk', sets: '5 min', rest: '-' },
        { name: 'Run at steady pace', sets: '35 min', rest: '-' },
        { name: 'Cool-down Walk', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Cycling Session',
      duration: 45,
      calories: 400,
      exercises: [
        { name: 'Easy Pedaling', sets: '5 min', rest: '-' },
        { name: 'Moderate Cycling', sets: '35 min', rest: '-' },
        { name: 'Cool-down', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Swimming Laps',
      duration: 40,
      calories: 350,
      exercises: [
        { name: 'Warm-up', sets: '5 min easy', rest: '-' },
        { name: 'Freestyle Laps', sets: '30 min', rest: '-' },
        { name: 'Cool-down', sets: '5 min easy', rest: '-' },
      ]
    },
    {
      name: 'Jump Rope Session',
      duration: 25,
      calories: 280,
      exercises: [
        { name: 'Basic Jumps', sets: '3x3 min', rest: '30 sec' },
        { name: 'High Knees', sets: '3x2 min', rest: '30 sec' },
        { name: 'Double Unders', sets: '3x1 min', rest: '45 sec' },
      ]
    },
    {
      name: 'Rowing Machine',
      duration: 30,
      calories: 320,
      exercises: [
        { name: 'Warm-up Row', sets: '5 min', rest: '-' },
        { name: 'Steady State Row', sets: '20 min', rest: '-' },
        { name: 'Cool-down', sets: '5 min', rest: '-' },
      ]
    },
  ],
  hiit: [
    {
      name: 'Tabata Burn',
      duration: 25,
      calories: 300,
      exercises: [
        { name: 'Burpees', sets: '8x 20s on/10s off', rest: '1 min after' },
        { name: 'Jump Squats', sets: '8x 20s on/10s off', rest: '1 min after' },
        { name: 'Mountain Climbers', sets: '8x 20s on/10s off', rest: '1 min after' },
        { name: 'High Knees', sets: '8x 20s on/10s off', rest: 'done' },
      ]
    },
    {
      name: 'Sprint Intervals',
      duration: 30,
      calories: 350,
      exercises: [
        { name: 'Warm-up Jog', sets: '5 min', rest: '-' },
        { name: 'Sprint', sets: '30 sec', rest: '90 sec x 8' },
        { name: 'Cool-down', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Metabolic Circuit',
      duration: 35,
      calories: 400,
      exercises: [
        { name: 'Kettlebell Swings', sets: '45 sec', rest: '15 sec' },
        { name: 'Box Jumps', sets: '45 sec', rest: '15 sec' },
        { name: 'Battle Ropes', sets: '45 sec', rest: '15 sec' },
        { name: 'Burpees', sets: '45 sec', rest: '15 sec' },
        { name: 'Repeat Circuit', sets: '4 rounds', rest: '2 min between' },
      ]
    },
    {
      name: 'Bodyweight HIIT',
      duration: 30,
      calories: 320,
      exercises: [
        { name: 'Jumping Jacks', sets: '40 sec', rest: '20 sec' },
        { name: 'Push-ups', sets: '40 sec', rest: '20 sec' },
        { name: 'Squat Jumps', sets: '40 sec', rest: '20 sec' },
        { name: 'Plank Jacks', sets: '40 sec', rest: '20 sec' },
        { name: 'Repeat Circuit', sets: '5 rounds', rest: '1 min between' },
      ]
    },
    {
      name: 'Hill Sprints',
      duration: 25,
      calories: 280,
      exercises: [
        { name: 'Warm-up Jog', sets: '5 min', rest: '-' },
        { name: 'Sprint Up Hill', sets: '20 sec', rest: 'Walk down' },
        { name: 'Repeat', sets: '10 rounds', rest: '-' },
        { name: 'Cool-down', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'EMOM Challenge',
      duration: 20,
      calories: 250,
      exercises: [
        { name: 'Minute 1: 15 Burpees', sets: 'EMOM', rest: 'remaining time' },
        { name: 'Minute 2: 20 Squats', sets: 'EMOM', rest: 'remaining time' },
        { name: 'Minute 3: 15 Push-ups', sets: 'EMOM', rest: 'remaining time' },
        { name: 'Minute 4: 20 Lunges', sets: 'EMOM', rest: 'remaining time' },
        { name: 'Repeat', sets: '5 rounds', rest: '-' },
      ]
    },
  ],
  sport_practice: [
    {
      name: 'Basketball Skills',
      duration: 60,
      calories: 450,
      exercises: [
        { name: 'Dynamic Warm-up', sets: '10 min', rest: '-' },
        { name: 'Dribbling Drills', sets: '15 min', rest: '-' },
        { name: 'Shooting Practice', sets: '20 min', rest: '-' },
        { name: 'Defensive Slides', sets: '10 min', rest: '-' },
        { name: 'Cool-down Stretches', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Football Conditioning',
      duration: 75,
      calories: 550,
      exercises: [
        { name: 'Agility Ladder', sets: '10 min', rest: '-' },
        { name: 'Cone Drills', sets: '15 min', rest: '-' },
        { name: 'Sprint Work', sets: '20 min', rest: '-' },
        { name: 'Position Drills', sets: '20 min', rest: '-' },
        { name: 'Cool-down', sets: '10 min', rest: '-' },
      ]
    },
    {
      name: 'Soccer Training',
      duration: 60,
      calories: 480,
      exercises: [
        { name: 'Jogging & Dynamic Stretches', sets: '10 min', rest: '-' },
        { name: 'Ball Control Drills', sets: '15 min', rest: '-' },
        { name: 'Passing & Receiving', sets: '15 min', rest: '-' },
        { name: 'Small-sided Games', sets: '15 min', rest: '-' },
        { name: 'Cool-down', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Swimming Practice',
      duration: 60,
      calories: 500,
      exercises: [
        { name: 'Warm-up Laps', sets: '10 min', rest: '-' },
        { name: 'Stroke Technique', sets: '20 min', rest: '-' },
        { name: 'Sprint Sets', sets: '20 min', rest: '-' },
        { name: 'Cool-down Laps', sets: '10 min', rest: '-' },
      ]
    },
    {
      name: 'Track Practice',
      duration: 60,
      calories: 450,
      exercises: [
        { name: 'Dynamic Warm-up', sets: '10 min', rest: '-' },
        { name: 'Technique Drills', sets: '15 min', rest: '-' },
        { name: 'Speed Work', sets: '20 min', rest: '-' },
        { name: 'Endurance Run', sets: '10 min', rest: '-' },
        { name: 'Cool-down', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Tennis Drills',
      duration: 60,
      calories: 420,
      exercises: [
        { name: 'Warm-up Rally', sets: '10 min', rest: '-' },
        { name: 'Forehand/Backhand Drills', sets: '20 min', rest: '-' },
        { name: 'Serve Practice', sets: '15 min', rest: '-' },
        { name: 'Point Play', sets: '10 min', rest: '-' },
        { name: 'Cool-down', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Wrestling Practice',
      duration: 75,
      calories: 600,
      exercises: [
        { name: 'Warm-up & Conditioning', sets: '15 min', rest: '-' },
        { name: 'Technique Drilling', sets: '25 min', rest: '-' },
        { name: 'Live Wrestling', sets: '25 min', rest: '-' },
        { name: 'Conditioning Finisher', sets: '10 min', rest: '-' },
      ]
    },
  ],
  flexibility: [
    {
      name: 'Full Body Stretch',
      duration: 25,
      calories: 80,
      exercises: [
        { name: 'Neck Rolls', sets: '2x30 sec each', rest: '-' },
        { name: 'Shoulder Stretch', sets: '30 sec each', rest: '-' },
        { name: 'Quad Stretch', sets: '30 sec each', rest: '-' },
        { name: 'Hamstring Stretch', sets: '45 sec each', rest: '-' },
        { name: 'Hip Flexor Stretch', sets: '45 sec each', rest: '-' },
        { name: 'Child\'s Pose', sets: '1 min', rest: '-' },
        { name: 'Cat-Cow', sets: '10 reps', rest: '-' },
        { name: 'Pigeon Pose', sets: '1 min each', rest: '-' },
      ]
    },
    {
      name: 'Yoga Flow',
      duration: 30,
      calories: 120,
      exercises: [
        { name: 'Sun Salutation A', sets: '5 rounds', rest: '-' },
        { name: 'Warrior Sequence', sets: '2 each side', rest: '-' },
        { name: 'Balance Poses', sets: '2 min each', rest: '-' },
        { name: 'Floor Stretches', sets: '10 min', rest: '-' },
        { name: 'Savasana', sets: '5 min', rest: '-' },
      ]
    },
    {
      name: 'Active Recovery',
      duration: 30,
      calories: 100,
      exercises: [
        { name: 'Light Walk', sets: '10 min', rest: '-' },
        { name: 'Foam Rolling', sets: '10 min', rest: '-' },
        { name: 'Static Stretching', sets: '10 min', rest: '-' },
      ]
    },
    {
      name: 'Mobility Work',
      duration: 20,
      calories: 60,
      exercises: [
        { name: 'Ankle Circles', sets: '2x15 each', rest: '-' },
        { name: 'Hip Circles', sets: '2x15 each', rest: '-' },
        { name: 'Shoulder Dislocates', sets: '2x15', rest: '-' },
        { name: 'Thoracic Rotations', sets: '2x10 each', rest: '-' },
        { name: 'World\'s Greatest Stretch', sets: '5 each side', rest: '-' },
      ]
    },
  ],
};

export const WORKOUT_TYPE_LABELS = {
  strength: { label: '💪 Strength', color: 'from-red-500 to-orange-500' },
  cardio: { label: '🏃 Cardio', color: 'from-blue-500 to-cyan-500' },
  sport_practice: { label: '🏆 Sport Practice', color: 'from-purple-500 to-pink-500' },
  flexibility: { label: '🧘 Flexibility', color: 'from-green-500 to-teal-500' },
  hiit: { label: '⚡ HIIT', color: 'from-yellow-500 to-orange-500' },
  rest: { label: '😴 Rest', color: 'from-gray-400 to-gray-500' },
};