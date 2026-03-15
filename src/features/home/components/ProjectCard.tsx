const ProjectCard = ({ title, location, image }: any) => (
    <div className="group cursor-pointer">
      <div className="aspect-video w-full rounded-xl overflow-hidden mb-3">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{location}</p>
    </div>
  );

  export default ProjectCard;