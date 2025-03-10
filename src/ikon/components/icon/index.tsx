import { DynamicIcon } from 'lucide-react/dynamic';

function Icon({ name, ...props }: any) {
    return (
        <DynamicIcon name={name} {...props} />
    )
}

export default Icon