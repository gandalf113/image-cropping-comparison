'use client'; // Ensures this component is rendered on the client-side

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Gallery() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Fetch the groups.json manifest
    fetch('/groups.json')
        .then((response) => response.json())
        .then((data) => setGroups(data))
        .catch((error) => console.error('Error fetching groups:', error));
  }, []);

  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Image Comparison Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groups.map((group) => {
            // Determine the thumbnail path, prefer 16x9/1.jpg
            let thumbnail = null;
            if (group.aspects['16x9'] && group.aspects['16x9'].length > 0) {
              thumbnail = group.aspects['16x9'][0].path;
            } else {
              // Fallback to any available aspect ratio's first image
              const firstAspect = Object.keys(group.aspects)[0];
              if (firstAspect && group.aspects[firstAspect].length > 0) {
                thumbnail = group.aspects[firstAspect][0].path;
              }
            }

            return (
                <Link key={group.group} href={`/group/${encodeURIComponent(group.group)}`} passHref>
                  <p className="block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={group.group}
                            width={400}
                            height={225}
                            className="w-full h-auto"
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div className="w-full h-56 bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-700">No Thumbnail</span>
                        </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-center">{group.group}</h2>
                    </div>
                  </p>
                </Link>
            );
          })}
        </div>
      </div>
  );
}
