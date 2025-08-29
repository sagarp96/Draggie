import csv
import uuid
import random
from datetime import datetime, timedelta

# Tailwind CSS 3.x colors (a selection)
tailwind_colors = [
    'bg-slate-500', 'bg-gray-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500',
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
    'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
    'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-pink-500', 'bg-rose-500'
]

# Possible task statuses
statuses = ['TODO', 'IN_PROGRESS', 'DONE']

# Dummy user IDs
num_unique_users = 5
unique_user_ids = [str(uuid.uuid4()) for _ in range(num_unique_users)]

# Map each user ID to a unique color
shuffled_colors = random.sample(tailwind_colors, k=len(unique_user_ids))
user_color_map = dict(zip(unique_user_ids, shuffled_colors))

# Create a list of user IDs for the tasks, with repetitions
user_ids = unique_user_ids + random.choices(unique_user_ids, k=5)

# File to write to
file_path = 'tasks.csv'

# Number of tasks to generate
num_tasks = 20

# Header
header = ['id', 'user_id', 'name', 'status', 'description', 'tags', 'DueDate', 'created_by', 'time', 'color']

# Generate Data
tasks_data = []
for i in range(num_tasks):
    user_id = random.choice(user_ids)
    task = {
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'name': f'Task {i + 1}',
        'status': random.choice(statuses),
        'description': f'This is the description for task {i + 1}.',
        'tags': ','.join(random.sample(['feature', 'bug', 'refactor', 'testing', 'documentation'], k=random.randint(1, 3))),
        'DueDate': (datetime.now() + timedelta(days=random.randint(1, 30))).isoformat(),
        'created_by': user_id,  # Assuming creator is the user assigned
        'time': datetime.now().isoformat(),
        'color': user_color_map[user_id]
    }
    tasks_data.append(task)

# Write to CSV
with open(file_path, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=header)
    writer.writeheader()
    writer.writerows(tasks_data)

print(f'Successfully generated {num_tasks} tasks in {file_path}')
