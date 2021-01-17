import { join } from 'path'
import { Bar } from 'react-chartjs-2'

export default function PollView({ props, logs }) {

    const Polls = () => {
        return (
            <div className="overflow-y-auto h-full">
                {logs.polls.map(p => {
                    return (
                        <div key={`poll-${p.id}`}
                            className="flex flex-col max-w-full my-4">
                            <h3 className="text-lg">{p.question}</h3>
                            <div className="flex flex-col p-6 mt-4 bg-indigo-50 bg-opacity-50 rounded-md hover:bg-indigo-100 transition duration-300">
                                <label className="text-xs">Started on: {p.start_time}</label>
                                <label className="text-sm mt-4 mb-2">Multiple Answers Allowed: {p.allow_multiple ? 'Yes' : 'No'}</label>
                                <Bar
                                    data={{
                                        labels: p.options,
                                        datasets: [{
                                            label: p.question,
                                            data: p.results,
                                            backgroundColor: '#5580ff'
                                        }]
                                    }}
                                    options={{
                                        legend: {
                                            display: false,
                                        },
                                        tooltips: {
                                            displayColors: false,
                                            callbacks: {
                                                label: function (tooltipItem, data) {
                                                    return tooltipItem.value;
                                                },
                                                title: function (tooltipItem, data) {
                                                    return tooltipItem[0].label
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div {...props}>
            {logs.polls.length === 0 && ('No polls during this session')}
            <Polls />
        </div>
    )
}