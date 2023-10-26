import AspectRatio, { AspectRatioProps } from '@mui/joy/AspectRatio';

export default function WPElogo({ sx, ...props }: AspectRatioProps) {
    return (
        <AspectRatio
            ratio="1"
            variant="plain"
            {...props}
            sx={[
                {
                    width: 36,
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="36" height="36" viewBox="0 0 500 500">
                    <g id="XMLID_1_">
                        <path id="XMLID_2_" fill="#40BAC8" d="M191.3,432.5h117.4v-88.7l-28.6-28.6h-60.8l-27.9,28.6V432.5z M343,191.3l-27.9,27.9v61.5   l27.9,27.9h89.5V191.3H343z M308.7,67.5H191.3V157l27.9,27.9h60.8l28.6-27.9V67.5z M432.5,432.5v-88.7l-27.9-28.6h-89.5v117.4   H432.5z M95.4,67.5L67.5,95.4v89.5h117.4V67.5H95.4z M315.1,67.5V157l27.9,27.9h89.5V67.5H315.1z M250,267.2   c-9.3,0-16.5-7.9-16.5-16.5c0-9.3,7.9-16.5,16.5-16.5c9.3,0,16.5,7.9,16.5,16.5C266.5,259.3,259.3,267.2,250,267.2z M184.9,191.3   H67.5v117.4h88.7l28.6-27.9V191.3z M184.9,343.8l-28.6-28.6H67.5v117.4h88.7l28.6-27.9V343.8z" />
                    </g>
                </svg>
            </div>
        </AspectRatio>
    );
}

