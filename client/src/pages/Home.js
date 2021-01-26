import React, {useState} from 'react'
import ReactTooltip from 'react-tooltip'
import {Input, Textarea} from '../components/Input'
import {Button} from '../components/Button';

export const Home = () => {
	const [formExpanded, setFormExpanded] = useState(false)

	return (
		<div className="w-75 mx-auto">
			<div className={`card w-75 mx-auto mb-5 ${formExpanded ? 'p-2' : ''}`}>
				<form>
					<Input
						type="text"
						name="title"
						label="Введіть заголовок"
						actions={{onClick: () => setFormExpanded(true)}}
					/>
					{formExpanded &&
						<Textarea
							name="text"
							label="Нотатка..."
							styles={['mt-3']}
						/>
					}
				</form>
				{formExpanded &&
					<div className="d-flex align-items-center justify-content-between mt-3">
						<div className="flex-grow-1">
							<Button tooltip="Змінити колір">
								<i className="bi bi-palette d-flex align-items-center"></i>
							</Button>
							<ReactTooltip effect="solid"/>
							<Button tooltip="Архівувати" spaces={['ms-2']}>
								<i className="bi bi-archive d-flex align-items-center"></i>
							</Button>
							<ReactTooltip effect="solid"/>
							<Button tooltip="Додати ярлик" spaces={['ms-2']}>
								<i className="bi bi-tag d-flex align-items-center"></i>
							</Button>
							<ReactTooltip effect="solid"/>
							<Button tooltip="В вигляді списку" spaces={['ms-2']}>
								<i className="bi bi-list-task d-flex align-items-center"></i>
							</Button>
							<ReactTooltip effect="solid"/>
						</div>
						<Button
							color="outlineSecondary"
							size="sm"
							actions={{onClick: () => setFormExpanded(false)}}
						>Закрити</Button>
					</div>
				}
			</div>
			<div className="row row-cols-4 g-3">
				<div className="col">
					<div className="card h-100 bg-info">
						<div className="card-body">
							<h5 className="card-title">Нотатка №1</h5>
							<p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur molestiae obcaecati, optio praesentium vitae voluptatem!</p>
						</div>
						<div className="card-footer d-flex justify-content-between">
							<Button
								size="sm"
								color="outlineDark"
								tooltip="Змінити колір"
							>
								<i className="bi bi-palette d-flex align-items-center"></i>
							</Button>
							<ReactTooltip effect="solid"/>
							<Button
								size="sm"
								color="outlineDark"
								tooltip="Архівувати"
							>
								<i className="bi bi-archive d-flex align-items-center"></i>
							</Button>
							<ReactTooltip effect="solid"/>
							<Button
								size="sm"
								color="outlineDark"
								tooltip="Додати ярлик"
							>
								<i className="bi bi-tag d-flex align-items-center"></i>
							</Button>
							<ReactTooltip effect="solid"/>
							<Button
								size="sm"
								color="outlineDark"
								tooltip="Видалити"
							>
								<i className="bi bi-trash d-flex align-items-center"></i>
							</Button>
							<ReactTooltip effect="solid"/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
