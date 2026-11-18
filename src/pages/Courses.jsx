import { useState } from "react";
import { GraduationCap } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import CourseCard from "@/components/cards/CourseCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { CardGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAsync } from "@/hooks/useAsync";
import { getCourses } from "@/services/courseService";
import { programs } from "@/data/courses";

const INITIAL = {
  search: "",
  semester: "all",
  type: "all",
  sks: "all",
  programId: "all",
};

export default function Courses() {
  const [filters, setFilters] = useState(INITIAL);
  const { data, meta, loading, error, refresh, refreshedAt } = useAsync(
    () => getCourses(filters),
    [filters],
  );

  const set = (key) => (value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const totalSks = (data || []).reduce((sum, c) => sum + c.sks, 0);

  return (
    <>
      <PageHeader
        title="Mata Kuliah"
        subtitle="Katalog mata kuliah yang menjadi rujukan jawaban ASCA untuk pertanyaan KRS."
        onRefresh={refresh}
        refreshedAt={refreshedAt}
        loading={loading}
      />

      <FilterBar
        search={filters.search}
        onSearchChange={set("search")}
        searchPlaceholder="Cari nama atau kode mata kuliah…"
        onReset={() => setFilters(INITIAL)}
        filters={[
          {
            id: "semester",
            label: "Semester",
            value: filters.semester,
            onChange: set("semester"),
            options: [
              { value: "all", label: "Semua semester" },
              ...Array.from({ length: 8 }, (_, i) => ({
                value: String(i + 1),
                label: `Semester ${i + 1}`,
              })),
            ],
          },
          {
            id: "type",
            label: "Jenis",
            value: filters.type,
            onChange: set("type"),
            options: [
              { value: "all", label: "Wajib & pilihan" },
              { value: "wajib", label: "Wajib" },
              { value: "pilihan", label: "Pilihan" },
            ],
          },
          {
            id: "sks",
            label: "SKS",
            value: filters.sks,
            onChange: set("sks"),
            options: [
              { value: "all", label: "Semua SKS" },
              ...[2, 3, 4, 6].map((n) => ({
                value: String(n),
                label: `${n} SKS`,
              })),
            ],
          },
          {
            id: "program",
            label: "Program studi",
            value: filters.programId,
            onChange: set("programId"),
            options: [
              { value: "all", label: "Semua program studi" },
              ...programs.map((p) => ({ value: p.id, label: p.label })),
            ],
          },
        ]}
      />

      {!loading && data?.length ? (
        <p className="mt-4 text-[13px] text-muted">
          <span className="tabular font-semibold text-ink">
            {meta?.total ?? data.length}
          </span>{" "}
          mata kuliah ·{" "}
          <span className="tabular font-semibold text-ink">{totalSks}</span> SKS
          total pada hasil ini
        </p>
      ) : null}

      <div className="mt-4">
        {loading ? (
          <CardGridSkeleton count={6} height="h-56" />
        ) : error ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : !data?.length ? (
          <EmptyState
            icon={GraduationCap}
            title="Mata kuliah tidak ditemukan"
            description="Tidak ada mata kuliah yang cocok dengan kombinasi filter ini."
            actionLabel="Bersihkan filter"
            onAction={() => setFilters(INITIAL)}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
