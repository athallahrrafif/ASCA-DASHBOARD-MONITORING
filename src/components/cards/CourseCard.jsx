import { GitBranch } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'

export default function CourseCard({ course }) {
  return (
    <article className="card flex h-full flex-col p-5 transition-shadow duration-300 ease-calm hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[12.5px] tracking-tight text-purple-600 dark:text-purple-300">{course.code}</span>
        <StatusBadge status={course.type} />
      </div>

      <h3 className="mt-2.5 font-display text-[19px] leading-snug text-ink">{course.name}</h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">{course.description}</p>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-[13px]">
        <div>
          <dt className="text-muted">SKS</dt>
          <dd className="tabular mt-0.5 font-semibold text-ink">{course.sks}</dd>
        </div>
        <div>
          <dt className="text-muted">Semester</dt>
          <dd className="tabular mt-0.5 font-semibold text-ink">{course.semester}</dd>
        </div>
        <div>
          <dt className="text-muted">Prasyarat</dt>
          <dd className="mt-0.5 font-semibold text-ink">
            {course.prerequisites.length ? course.prerequisites.length : '—'}
          </dd>
        </div>
      </dl>

      {course.prerequisites.length ? (
        <p className="mt-3 flex items-center gap-1.5 font-mono text-[12px] text-muted">
          <GitBranch size={13} aria-hidden />
          {course.prerequisites.join(' · ')}
        </p>
      ) : null}
    </article>
  )
}
