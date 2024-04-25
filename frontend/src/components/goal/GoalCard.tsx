import DeadlineAdherence from "./DeadlineAdherence"
import GoalVelocity from "./GoalVelocity"

export default function GoalCard (goal: any) {

    return (
        <div className="w-[100%] max-w-[800px] rounded-lg overflow-hidden shadow-lg bg-white px-6 py-4">

            {/* upper div */}
            <div className="upper-div flex ">
                <div className="flex w-[50%] items-center mb-4">
                    <h5 className="text-lg font-bold">RUN 100KM</h5>
                    <span className="text-sm text-gray-600">deadline: 2024-10-05</span>
                </div>
                
                <div className="flex justify-between items-center">
                        <DeadlineAdherence percentage={50} />

                </div>
            </div>

            <div className="lower-div">
                <div className="text-right mt-2">
                    <span className="text-sm font-bold text-green-500">100%</span>
                </div>
                <div className="relative mb-4">
                    <div className="w-full bg-gray-300 h-1.5 rounded-full">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{width: "50%"}}></div>
                    </div>
                    <div className="absolute top-0 -mt-2" style={{left:'50%'}}>
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                </div>
            </div>
            {/* lower div */}
        </div>
    )

}