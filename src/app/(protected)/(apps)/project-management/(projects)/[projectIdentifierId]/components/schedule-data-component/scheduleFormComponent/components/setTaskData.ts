export default function SetTaskData({ scheduleData }: { scheduleData: Record<string, any> }) {
    const tasks = [];
    let groupTasks = [];
    function groupProgress(parentId: string) {
        let progress = 0;
        let counter = 0;
        for (let each of scheduleData.task) {
            if (each.parentId == parentId) {
                counter++;
                progress += parseFloat(each.progress);
            }
        }
        return progress / counter;
    }

    if (scheduleData.group && Object.keys(scheduleData.group).length) {
        for (const eachGroupKey in scheduleData.group) {
            const progress = groupProgress(scheduleData.group[eachGroupKey].id);
            tasks.push({
                id: scheduleData.group[eachGroupKey].id,
                orderId: scheduleData.group[eachGroupKey].id,
                parentId: null,
                title: scheduleData.group[eachGroupKey].groupName,
                start: (scheduleData.group[eachGroupKey].groupStartDate),
                end: (scheduleData.group[eachGroupKey].groupEndDate),
                summary: true,
                expanded: true,
                unique_id: scheduleData.group[eachGroupKey].id,
                progress: Number.isInteger(progress) ? progress : progress.toFixed(2),
                parentTask: true
            });

            groupTasks = scheduleData.task.filter(task => task.parentId === scheduleData.group[eachGroupKey].id);
            for (const each of groupTasks) {
                const progress = each.progress ? each.progress : 0;
                tasks.push({
                    id: each.id,
                    orderId: each.id,
                    parentId: each.parentId,
                    title: each.taskName,
                    start: (each.taskStart),
                    end: (each.taskEnd),
                    unique_id: each.id,
                    progress: progress,
                    parentTask: false
                });
            }
        }
    }

    const ungroupedTasks = scheduleData.task.filter(task => task.parentId == null);
    for (let each of ungroupedTasks) {
        var progress = each.progress ? each.progress : 0;
        tasks.push({
            id: each.id,
            orderId: each.id,
            parentId: null,
            title: each.taskName,
            start: (each.taskStart),
            end: (each.taskEnd),
            unique_id: each.id,
            progress: progress,
            parentTask: false
        });
    }

    return tasks;
}
