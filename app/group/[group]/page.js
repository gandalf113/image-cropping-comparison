// app/group/[group]/page.jsx
'use client'; // Ensures this component is rendered on the client-side

import {useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {useEffect, useState} from 'react';

export default function ComparisonPage({params}) {
    const {group} = params;
    const [groupData, setGroupData] = useState(null);

    useEffect(() => {
        // Fetch the groups.json manifest
        fetch('/groups.json')
            .then((response) => response.json())
            .then((data) => {
                // Find the group data
                const foundGroup = data.find((g) => g.group === group);
                if (foundGroup) {
                    setGroupData(foundGroup);
                } else {
                    // Handle group not found
                    console.error('Group not found:', group);
                }
            })
            .catch((error) => console.error('Error fetching groups:', error));
    }, [group]);

    if (!groupData) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Link href="/">
                <p className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Gallery</p>
            </Link>
            <h1 className="text-3xl font-bold mb-8 text-center">Comparing: {groupData.group}</h1>
            <div className="space-y-12">
                {Object.entries(groupData.aspects).map(([aspect, images]) => (
                    <div key={aspect}>
                        <h2 className="text-2xl font-semibold mb-4">{aspect}</h2>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative w-64 h-36">
                                    <Image
                                        src={image.path}
                                        alt={`${aspect} - Image ${index + 1}`}
                                        width={256}
                                        height={144}
                                        className="border rounded"
                                        style={{objectFit: 'contain'}}
                                    />
                                    <span
                                        className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {image.filename === "1.jpg" ? "Lambda Cropper" : "New Image Cropper"}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
