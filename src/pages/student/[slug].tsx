import { useRouter } from 'next/router'
import Image from "next/image";

export default function StudentDetail() {
    const route = useRouter();
    return (
        <>
            <div className='wrapper flex flex-col'>
                <div className='profile-image flex flex-col'>
                    <div className='student-background-image relative'>
                        <Image src='/images/ZN9P0S.jpg'
                            width={300}
                            height={1}
                            style={{
                                width: '100%',
                                height: '350px'
                            }}
                            alt='student-background-image'
                        />
                        <div className='student-profile-picture absolute  bottom-[-100px] size-[200px] left-24'>
                            <Image src="https://static.vecteezy.com/system/resources/thumbnails/004/899/680/small/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg"
                                width={200}
                                height={200}
                                alt='student-profile-picture'
                                style={
                                    {
                                        border: '5px solid black',
                                        borderRadius: '50%',
                                        width: '200px',
                                        height: '200px',
                                    }
                                }
                            />
                        </div>
                    </div>
                    <div className='student-description flex flex-row'>
                        <div className='void w-[300px] h-[100px]'>
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold'>Emily Davis</h1>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm'>Grade 12</span>
                                <span className='text-sm'>History</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='body-section flex flex-col pl-11'>
                        <div className='student-basic-info'>
                                <div>
                                    <h2 className='text-lg font-semibold'>Basic Information</h2>
                                    <div className='text-muted-foreground'>
                                        <div>Class: History</div>
                                        <div>Grade: A-</div>
                                    </div>
                                </div>

                                <div className="student-nav-links">
                                    <ul>
                                        <li className='active'>profile</li>
                                        <li>class info</li>
                                        <li>tasks</li>
                                        <li>parent contact</li>
                                    </ul>

                                </div>
                        </div>
                        <div className='student-body-content'>

                        </div>
                </div>
            </div>

        </>
    )
}