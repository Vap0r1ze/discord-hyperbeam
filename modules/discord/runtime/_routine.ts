// type Last<T extends any[]> = T extends [...any[], infer R] ? R : never

type Task = { name: string, run: (...args: any[]) => Promise<any> }
type NextParam<Tasks extends Task[]> = Tasks extends [...any[], infer Last extends Task] ? Awaited<ReturnType<Last['run']>> : undefined

class Routine<Tasks extends Task[]> {
    constructor(private tasks: Tasks) {}

    add<Name extends string, Return>(name: Name, run: (data: NextParam<Tasks>) => Promise<Return>) {
        return new Routine([...this.tasks, { name, run }] as const)
    }

    use() {
        const index = ref(0)
        const progress = computed(() => this.tasks[index.value]?.name ?? null)
        const done = computed(() => progress.value == null)

        const state = ref<any>()

        const next = async () => {
            if (progress.value == null) return
            state.value = await this.tasks[index.value].run(state.value)
            index.value++
        }

        const { status, refresh } = useAsyncData(async () => {
            while (!done.value) await next()
            return {}
        }, {
            dedupe: 'defer',
        })

        return { status, progress, done, retry: refresh }
    }
}

export function createRoutine() {
    return new Routine([])
}
