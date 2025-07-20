import { useState } from 'react'

function App() {
	const [tasks, setTasks] = useState([])
	const [sortType, setSortType] = useState('date') // Priority
	const [sortOrder, setSortOrder] = useState('asc') // desc

	const [openSection, setOpenSection] = useState({
		taskList: false,
		tasks: true,
		completedTasks: true,
	})

	function toggleSection(section) {
		setOpenSection(prev => ({
			...prev,
			[section]: !prev[section],
		}))
	}

	function addTask(task) {
		setTasks(prev => [...prev, { ...task, completed: false, id: Date.now() }])
	}

	function deleteTask(id) {
		setTasks(tasks.filter(task => task.id !== id))
	}

	function completeTask(id) {
		setTasks(
			tasks.map(task => (task.id === id ? { ...task, completed: true } : task))
		)
	}

	function sortTask(tasks) {
		return tasks.slice().sort((a, b) => {
			if (sortType === 'priority') {
				const priorityOrder = { High: 1, Medium: 2, Low: 3 }
				return sortOrder == 'asc'
					? priorityOrder[a.priority] - priorityOrder[b.priority]
					: priorityOrder[b.priority] - priorityOrder[a.priority]
			} else {
				return sortOrder === 'asc'
					? new Date(a.deadline) - new Date(b.deadline)
					: new Date(b.deadline) - new Date(a.deadline)
			}
		})
	}

	function toggleSortOrder(type) {
		if (sortType === type) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortType(type)
			setSortOrder('asc')
		}
	}

	const activeTasks = sortTask(tasks.filter(task => !task.completed))

	const CompletedTasks = tasks.filter(task => task.completed)

	console.log(CompletedTasks)

	return (
		<div className='app'>
			<div className='task-container'>
				<h1>Task List with Priority</h1>
				<button
					className={`close-button ${openSection.taskList ? 'open' : ''}`}
					onClick={() => toggleSection('taskList')}
				>
					+
				</button>
				{openSection.taskList && <TaskForm addTask={addTask} />}
			</div>

			<div className='task-container'>
				<h2>Tasks:</h2>
				<button
					className={`close-button ${openSection.tasks ? 'open' : ''}`}
					onClick={() => toggleSection('tasks')}
				>
					+
				</button>
				<div className='sort-controls'>
					<button
						className={`sort-button ${sortType === 'date' ? 'active' : ''}`}
						onClick={() => toggleSortOrder('date')}
					>
						By Date{' '}
						{sortType === 'date' && (sortOrder === 'asc' ? '\u2191' : '\u2193')}
					</button>
					<button
						className={`sort-button ${sortType === 'priority' ? 'active' : ''}`}
						onClick={() => toggleSortOrder('priority')}
					>
						By Priority{' '}
						{sortType === 'priority' &&
							(sortOrder === 'asc' ? '\u2191' : '\u2193')}
					</button>
				</div>
				{openSection.tasks && (
					<TaskList
						deleteTask={deleteTask}
						activeTasks={activeTasks}
						completeTask={completeTask}
					/>
				)}
			</div>
			<div className='completed-task-container'>
				<h2>Completed Tasks</h2>
				<button
					className={`close-button ${openSection.completedTasks ? 'open' : ''}`}
					onClick={() => toggleSection('completedTasks')}
				>
					+
				</button>
				{openSection.completedTasks && (
					<CompletedTaskList
						completedTasks={CompletedTasks}
						deleteTask={deleteTask}
					/>
				)}
			</div>
			<Footer />
		</div>
	)
}

function TaskForm({ addTask }) {
	const [title, SetTitle] = useState('')
	const [priority, SetPriority] = useState('Low')
	const [deadline, SetDeadline] = useState('')

	function handlerSubmit(event) {
		event.preventDefault()
		if (title.trim() && deadline) {
			addTask({ title, priority, deadline })
			SetTitle('')
			SetPriority('Low')
			SetDeadline('')
		}
	}

	return (
		<form action='' className='task-form' onSubmit={handlerSubmit}>
			<input
				type='text'
				value={title}
				placeholder='Task title'
				required
				onChange={event => SetTitle(event.target.value)}
			/>
			<select
				value={priority}
				onChange={event => SetPriority(event.target.value)}
			>
				<option value='High'>High</option>
				<option value='Medium'>Medium</option>
				<option value='Low'>Low</option>
			</select>
			<input
				type='datetime-local'
				required
				value={deadline}
				onChange={event => SetDeadline(event.target.value)}
			/>
			<button type='submit'>Add task</button>
		</form>
	)
}

function TaskList({ activeTasks, deleteTask, completeTask }) {
	return (
		<ul className='task-list'>
			{activeTasks.map(task => (
				<TaskItem
					completeTask={completeTask}
					deleteTask={deleteTask}
					task={task}
					key={task.id}
				/>
			))}
		</ul>
	)
}
function CompletedTaskList({ completedTasks, deleteTask }) {
	return (
		<ul className='completed-task-list'>
			{completedTasks.map(task => (
				<TaskItem key={task.id} task={task} deleteTask={deleteTask} />
			))}
		</ul>
	)
}

function TaskItem({ task, deleteTask, completeTask }) {
	const { title, priority, deadline, id } = task
	console.log(task)

	return (
		<li className={`task-item ${priority.toLowerCase()}`}>
			<div className='task-info'>
				<div>
					{title} <strong>{priority}</strong>
				</div>
				<div className='task-deadline'>Due: {deadline}</div>
			</div>
			<div className='task-buttons'>
				{completeTask && (
					<button className='complete-button' onClick={() => completeTask(id)}>
						Complete
					</button>
				)}
				<button className='delete-button' onClick={() => deleteTask(id)}>
					Delete
				</button>
			</div>
		</li>
	)
}

function Footer() {
	return (
		<footer className='footer'>
			<p>
				Technologies and React concepts used: React, JSX, props, useState,
				component composition, conditional rendering, array methods (map,
				filter), event handling.
			</p>
		</footer>
	)
}

export default App
