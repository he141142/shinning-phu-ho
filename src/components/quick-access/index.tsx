import HomeIcon from '@mui/icons-material/Home';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import InfoIcon from '@mui/icons-material/Info';
export default function QuickAcess() {
    return (
        <>
            <ul className="flex flex-col md:flex-col gap-y-6 pt-[20px]">
                <li className="group active hover:bg-violet-600
                h-[70px]
                 active:bg-violet-700 
                 p-[10px] cursor-pointer">
                    <div className="group-hover:text-white">
                        <div className='inline'>
                            <HomeIcon sx={{
                                fontSize: 40
                            }} />
                        </div>
                        <p className='inline ml-4 text-xl font-bold'>Home</p>
                    </div>
                </li>
                <li className="group active hover:bg-violet-600 active:bg-violet-700 p-[10px] cursor-pointer">
                    <div className="group-hover:text-white">
                        <div className='inline'>
                            <DesignServicesIcon sx={{
                                fontSize: 40
                            }} />
                        </div>
                        <p className='inline ml-4 text-xl font-bold'>Services</p>
                    </div>
                </li>
                <li className="group active hover:bg-violet-600 active:bg-violet-700 p-[10px] cursor-pointer">
                    <div className="group-hover:text-white">
                        <div className='inline'>
                            <ContactPhoneIcon  sx={{
                                fontSize: 40
                            }}/>
                        </div>
                        <p className='inline ml-4 text-xl font-bold'>Contact</p>
                    </div>
                </li>
                <li className="group active hover:bg-violet-600 active:bg-violet-700 p-[10px] cursor-pointer">
                    <div className="group-hover:text-white">
                        <div className='inline'>
                            <InfoIcon sx={{
                                fontSize: 40
                            }} />
                        </div>
                        <p className='inline ml-4 text-xl font-bold'>About</p>
                    </div>
                </li>
            </ul>
        </>
    )
}