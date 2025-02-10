import profile from '../assets/user_logo.png';

const NavigationBar = () => {
    return (
        <nav className="flex justify-between items-center bg-zinc-400 top-0 fixed z-50 w-full gap-5 p-4 sm:px-12">
            <a href="/home" className="flex items-center gap-1">
                {/* We can replace this with an actual logo later on */}
                <img
                    src="../../public/jollibuilders.png"
                    className="w-8 h-8 sm:w-12 sm:h-12"
                    alt="Jollibuilders FIP logo"
                />

                <h1 className="text-2xl font-bold text-dark-100 ml-2">
                    Job
                    <span> Connector</span>
                </h1>
            </a>

            <a href="/account" className="flex items-center gap-1">
                <img
                    src={profile}
                    className="w-8 h-8 sm:w-12 sm:h-12"
                    alt="profile logo"
                />
            </a>
        </nav>
    )
}

export default NavigationBar;